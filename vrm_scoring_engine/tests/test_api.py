import json
import os
import pytest
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

def load_payload(filename):
    """Helper function to load JSON payloads from sample_payloads directory."""
    base_path = os.path.join(os.path.dirname(__file__), "..", "sample_payloads")
    with open(os.path.join(base_path, filename), "r") as f:
        return json.load(f)

@pytest.mark.parametrize("filename,expected_risk", [
    ("low_risk.json", "Low"),
    ("medium_risk.json", "Medium"),
    ("high_risk.json", "High"),
])
def test_score_endpoint_valid_payloads(filename, expected_risk):
    """Test the /score endpoint with valid payloads and verify risk tiers."""
    payload = load_payload(filename)
    response = client.post("/score", json=payload)
    assert response.status_code == 200, f"Failed on {filename} with status {response.status_code}"
    data = response.json()
    assert data["risk_tier"] == expected_risk

@pytest.mark.parametrize("filename", [
    "low_risk.json",
    "medium_risk.json",
    "high_risk.json",
])
def test_validate_endpoint(filename):
    """Test the /validate endpoint to ensure payload validation."""
    payload = load_payload(filename)
    response = client.post("/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "valid" in data
    assert "missing_evidence" in data
    assert "errors" in data

def test_rules_endpoint():
    """Test the /rules endpoint to verify retrieval of scoring rules."""
    response = client.get("/rules")
    assert response.status_code == 200
    data = response.json()
    assert "section_weights" in data
    assert "red_flag_rules" in data

def test_score_endpoint_red_flag_override():
    """Test /score endpoint for payload that triggers red flag overrides."""
    payload = load_payload("low_risk.json")
    for section in payload["sections"]:
        for q in section.get("questions", []):
            if q.get("id") == "AC_02":
                q["answer"] = "No"

    response = client.post("/score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_tier"] == "High"
    assert "AC_02" in data["red_flags_triggered"]

def test_score_endpoint_invalid_payload():
    """Test /score endpoint with invalid payloads to check proper error handling."""
    invalid_payload = {"template_id": "test"}

    response = client.post("/score", json=invalid_payload)
    assert response.status_code == 422
    errors = response.json()["detail"]
    error_fields = [err["loc"][-1] for err in errors]
    assert "sections" in error_fields or "version" in error_fields

    # Sections not a list
    invalid_payload = {"template_id": "test", "version": "1.0", "sections": "not_a_list"}

    response = client.post("/score", json=invalid_payload)
    assert response.status_code == 422
    errors = response.json()["detail"]
    error_fields = [err["loc"][-1] for err in errors]
    assert "sections" in error_fields

    # Question missing 'id'
    invalid_payload = {
        "template_id": "test",
        "version": "1.0",
        "sections": [
            {"name": "Test Section", "questions": [{"answer": "Yes"}]}
        ]
    }

    response = client.post("/score", json=invalid_payload)
    assert response.status_code == 422
    errors = response.json()["detail"]
    error_fields = [err["loc"][-1] for err in errors]
    assert "id" in error_fields
