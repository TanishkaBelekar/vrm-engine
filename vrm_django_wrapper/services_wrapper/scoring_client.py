import requests

BASE_URL = "http://127.0.0.1:8001"  # Change as per your scoring service URL
TIMEOUT = 5  # seconds

def validate(payload):
    """
    Call the /validate endpoint of scoring service.
    Returns dict response or None if error.
    """
    try:
        response = requests.post(f"{BASE_URL}/validate", json=payload, timeout=TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Validation request failed: {e}")
        return None

def score(payload):
    """
    Call the /score endpoint of scoring service.
    Returns dict response or None if error.
    """
    try:
        response = requests.post(f"{BASE_URL}/score", json=payload, timeout=TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Scoring request failed: {e}")
        return None

def get_rules():
    """
    Call the /rules endpoint of scoring service.
    Returns dict response or None if error.
    """
    try:
        response = requests.get(f"{BASE_URL}/rules", timeout=TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Rules request failed: {e}")
        return None
