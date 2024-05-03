# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /home/node/app

# Install any needed packages specified in requirements.txt
COPY requirements.txt /home/node/app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's code
COPY . /home/node/app

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
