from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

# Example valid payload (simplified)
sample_payload = {
    "template_id": "template1",
    "version": "v1",
    "sections": [
        {
            "name": "Access Control",
            "questions": [
                {"id": "AC_01", "answer": "Yes", "mandatory": True},
                {"id": "AC_02", "answer": "No", "mandatory": True, "requires_evidence": True, "evidence_uploaded": True}
            ]
        }
    ]
}

def test_get_rules():
    response = client.get("/rules")
    assert response.status_code == 200
    data = response.json()
    assert "section_weights" in data
    assert "red_flag_rules" in data

def test_validate_valid_payload():
    response = client.post("/validate", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["missing_evidence"] == []
    assert data["errors"] == []

def test_score_valid_payload():
    response = client.post("/score", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "final_score" in data
    assert "risk_tier" in data
    assert "section_breakdown" in data
