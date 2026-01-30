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
                {
                    "id": "AC_02",
                    "answer": "No",
                    "mandatory": True,
                    "requires_evidence": True,
                    "evidence_uploaded": True
                }
            ]
        }
    ]
}

def test_get_rules():
    response = client.get("/v1/rules")
    assert response.status_code == 200

    data = response.json()

    # Top level should have 'rules'
    assert "rules" in data
    rules = data["rules"]

    # Now check keys inside 'rules'
    assert "version" in rules
    assert "section_weights" in rules
    assert "red_flag_rules" in rules




def test_validate_valid_payload():
    response = client.post("/v1/validate", json=sample_payload)
    assert response.status_code == 200

    data = response.json()
    assert data["valid"] is True
    assert data["missing_evidence"] == []
    assert data["errors"] == []


def test_score_valid_payload():
    response = client.post("/v1/score", json=sample_payload)
    assert response.status_code == 200

    data = response.json()
    assert "final_score" in data
    assert "risk_tier" in data
    assert "section_breakdown" in data
