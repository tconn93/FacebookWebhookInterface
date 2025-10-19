import hmac
import hashlib

def create_hmac_sha256(payload, app_secret):
    """
    Creates an HMAC SHA256 hash from a payload and an app secret.

    Args:
        payload (str): The data to be hashed.
        app_secret (str): The secret key.

    Returns:
        str: The hexadecimal representation of the HMAC SHA256 hash.
    """
    # Ensure payload and secret are bytes for HMAC
    payload_bytes = payload.encode('utf-8')
    secret_bytes = app_secret.encode('utf-8')

    # Create HMAC SHA256 hash
    hmac_obj = hmac.new(secret_bytes, payload_bytes, hashlib.sha256)

    # Get the hexadecimal digest
    hmac_digest = hmac_obj.hexdigest()

    return hmac_digest

# Example usage:
my_payload = '''{
  "field": "feed",
  "value": {
    "item": "status",
    "post_id": "44444444_444444444",
    "verb": "add",
    "published": 1,
    "created_time": 1760347839,
    "message": "Example post content.",
    "from": {
      "name": "Test Page",
      "id": "1067280970047460"
    }
  }
}'''
my_app_secret = '95df4b45f097cca983d6f065f3700c75'

sha256_signature = create_hmac_sha256(my_payload, my_app_secret)
print(f"HMAC SHA256 Signature: {sha256_signature}")