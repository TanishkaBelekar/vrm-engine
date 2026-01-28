from scoring_engine.engine import calculate_risk, validate_payload
import pytest

valid_payload = {
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

def test_validate_payload_success():
    assert validate_payload(valid_payload) is True

def test_validate_payload_fail_missing_answer():
    payload = {
        "sections": [
            {
                "name": "Access Control",
                "questions": [
                    {"id": "AC_01", "mandatory": True}
                ]
            }
        ]
    }
    with pytest.raises(ValueError):
        validate_payload(payload)

def test_calculate_risk_basic():
    result = calculate_risk(valid_payload)
    assert isinstance(result, dict)
    assert "final_score" in result
    assert "risk_tier" in result
