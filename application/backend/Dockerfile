# Use official Python base image
FROM python:3.9

WORKDIR /app

# Copy and install dependencies
COPY application/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --progress-bar on

# Copy the entire backend source code
COPY application/backend/ .

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
