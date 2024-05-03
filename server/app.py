from flask import Flask, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies
import os
from werkzeug.utils import secure_filename
from io import BytesIO
import openai
from docx import Document
import PyPDF2
import re
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from flask_bcrypt import Bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Load secret key from environment variable
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Set to True in production with CSRF protection
jwt = JWTManager(app)

# MongoDB Connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['your_database_name']  # Change to your database name
users_collection = db.users

def extract_text_from_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ''
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

def extract_text_from_docx(file_stream):
    try:
        doc = Document(file_stream)
        text = ''.join(para.text for para in doc.paragraphs)
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return None

def extract_text(file):
    file_stream = BytesIO()
    file.save(file_stream)
    file_stream.seek(0)
    text = None
    if file.filename.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_stream)
    elif file.filename.lower().endswith('.docx'):
        text = extract_text_from_docx(file_stream)
    else:
        raise ValueError("Unsupported file format")
    if text is None:
        raise ValueError("Failed to extract text from file.")
    return text

def extract_score(text):
    match = re.search(r'\b\d+(\.\d+)?/\d+\b', text)
    if match:
        return match.group(), text
    return "Score not found", text

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({
        'username': username,
        'password': hashed_password
    })
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = users_collection.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username)
        response = jsonify({'message': 'Login successful'})
        set_access_cookies(response, access_token)
        return response
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'Logged out successfully'})
    unset_jwt_cookies(response)
    return response

@app.route('/check_session', methods=['GET'])
@jwt_required(optional=True)
def check_session():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(authenticated=True, user=current_user), 200
    else:
        return jsonify(authenticated=False), 401

@app.route('/', methods=['POST'])
@jwt_required()
def index():
    cv_file = request.files.get('cv')
    job_description = request.form.get('jobDescription')
    if not cv_file or not job_description:
        return jsonify({'error': "Please upload a CV and provide a job description."}), 400
    if not cv_file.filename.endswith('.docx') and not cv_file.filename.endswith('.pdf'):
        return jsonify({'error': "Unsupported file format."}), 400
    cv_text = extract_text(cv_file)
    if cv_text is None:
        return jsonify({'error': "Failed to extract text from file."}), 500
    openai.api_key = os.getenv("OPENAI_API_KEY")
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that assesses the suitability of candidates for job roles based on their CVs. Rate the candidate's suitability on a scale of 1 to 10 and provide key points justifying your score."},
                {"role": "user", "content": f"Candidate's CV Summary:\n{cv_text}\n\nJob Description:\n{job_description}"}
            ]
        )
        result = response['choices'][0]['message']['content']
        score, justification = extract_score(result)
        return jsonify({'score': score, 'justification': justification})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
