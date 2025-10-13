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
  "entry": [
    {
      "time": 1520383571,
      "changes": [
        {
          "field": "photos",
          "value":
            {
              "verb": "update",
              "object_id": "10211885744794461"
            }
        }
      ],
      "id": "10210299214172187",
      "uid": "10210299214172187"
    }
  ],
  "object": "user"
}'''
my_app_secret = '9c28cd7f53849e3da404672dd1957e25'

sha256_signature = create_hmac_sha256(my_payload, my_app_secret)
print(f"HMAC SHA256 Signature: {sha256_signature}")