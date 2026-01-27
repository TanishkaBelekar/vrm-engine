import requests

BASE_URL = "http://127.0.0.1:8001"

def validate(payload):
    response = requests.post(f"{BASE_URL}/validate", json=payload)
    response.raise_for_status()
    return response.json()

def score(payload):
    response = requests.post(f"{BASE_URL}/score", json=payload)
    response.raise_for_status()
    return response.json()

def get_rules():
    response = requests.get(f"{BASE_URL}/rules")
    response.raise_for_status()
    return response.json()