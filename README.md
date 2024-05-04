# Resume and Job Description Analyzer

This project is a web application that analyzes resumes and job descriptions using an AI model to assess the suitability of candidates for specific job roles.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Setup](#setup)
    1. [Prerequisites](#prerequisites)
    2. [Environment Variables](#environment-variables)
    3. [Docker Setup](#docker-setup)
5. [Usage](#usage)
6. [Endpoints](#endpoints)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

This application uses Flask for the backend, MongoDB for the database, and React for the frontend. It integrates with OpenAI's GPT-4 model to evaluate candidate resumes against job descriptions.

## Features

- User registration and authentication using JWT cookies
- Resume and job description analysis
- AI-powered scoring and feedback
- RESTful API endpoints
- Secure handling of user data

## Technologies

- **Frontend:** React, Bootstrap
- **Backend:** Flask, Flask-JWT-Extended, PyMongo
- **Database:** MongoDB
- **AI:** OpenAI's GPT-4
- **Containerization:** Docker, Docker Compose

## Setup

### Prerequisites

- **Docker**: Make sure Docker is installed on your system.
- **OpenAI API Key**: Obtain an API key from OpenAI to use the GPT-4 model.

### Environment Variables

The application requires several environment variables for configuration. These are specified in `.env` files for both the client and server.

#### Server

- **FLASK_ENV**: The environment to run the Flask server in (`development` or `production`)
- **JWT_SECRET_KEY**: A secret key for JWT
- **MONGO_URI**: The MongoDB URI
- **OPENAI_API_KEY**: The OpenAI API key

#### Client

- **REACT_APP_BASE_URL**: The base URL for the backend API

### Docker Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd your-repo-name
   ```

3. **Run Docker Compose**:

   ```bash
   docker-compose --env-file ./server/.env up --build
   ```

   For production:

   ```bash
   docker-compose --env-file ./server/.env.production up --build
   ```

## Usage

Once the Docker containers are running, you can access the application:

- **Client**: `http://localhost:3000`
- **Server**: `http://localhost:5001`

### Endpoints

#### User Authentication

- **POST /register**: Register a new user
- **POST /login**: Log in an existing user
- **POST /logout**: Log out the current user
- **GET /check_session**: Check if the user is logged in

#### Resume Analysis

- **POST /**: Analyze a resume and job description

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.



