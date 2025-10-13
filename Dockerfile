# Use the official Python slim image as the base
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY fbWebhook/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app code
COPY fbWebhook/app.py .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables (can be overridden in docker-compose or at runtime)
ENV FB_VERIFY_TOKEN=cyborgtriggerwebhook
ENV N8N_WEBHOOK_URL=https://data.tcon.app/webhook-test/c2d6e127-140d-4c65-9c0d-f9dc3273d63d
ENV FB_APP_SECRET=9c28cd7f53849e3da404672dd1957e25

# Command to run the Flask app
CMD ["python", "app.py"]