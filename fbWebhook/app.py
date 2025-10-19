from flask import Flask, request, jsonify
import requests
import hashlib
import hmac
import os

app = Flask(__name__)

# Configuration - Replace with your values
FB_VERIFY_TOKEN = os.getenv('FB_VERIFY_TOKEN')  # Set in environment or replace
N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL')  # n8n webhook URL
FB_APP_SECRET = os.getenv('FB_APP_SECRET')  # For signature validation

# Webhook verification endpoint for Facebook
@app.route('/webhook', methods=['GET'])
def verify_webhook():
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    if mode == 'subscribe' and token == FB_VERIFY_TOKEN:
        print("Webhook verified successfully!")
        return challenge, 200
    else:
        return jsonify({'error': 'Invalid verification token'}), 403

# Webhook event handler
@app.route('/webhook', methods=['POST'])
def handle_webhook():
    # Verify the request signature
    signature = request.headers.get('X-Hub-Signature-256', '')
    if not verify_signature(request.get_data(), signature):
        return jsonify({'error': 'Invalid signature'}), 403

    # Get the webhook payload
    payload = request.get_json()

    # Forward the payload to n8n
    try:
        response = requests.get(N8N_WEBHOOK_URL, json=payload)
        if response.status_code == 200:
            print("Data forwarded to n8n successfully")
        else:
            print(f"Failed to forward to n8n: {response.status_code}")
    except requests.RequestException as e:
        print(f"Error forwarding to n8n: {e}")
        return jsonify({'error': 'Failed to forward to n8n'}), 500

    return jsonify({'status': 'success'}), 200

# Function to verify Facebook's request signature
def verify_signature(payload, signature):
    if not signature:
        return False
    expected_signature = hmac.new(
        key=FB_APP_SECRET.encode('utf-8'),
        msg=payload,
        digestmod=hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f'sha256={expected_signature}', signature)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)