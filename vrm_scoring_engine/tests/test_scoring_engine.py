import json
import os
import pytest
from scoring_engine.engine import calculate_risk, validate_payload

def load_payload(filename):
    base_path = os.path.join(os.path.dirname(__file__), "..", "sample_payloads")
    with open(os.path.join(base_path, filename), "r") as f:
        return json.load(f)

def test_low_risk_case():
    payload = load_payload("low_risk.json")
    result = calculate_risk(payload)

    assert result["risk_tier"] == "Low"
    assert result["final_score"] < 25  
    assert isinstance(result["red_flags_triggered"], list)
    assert isinstance(result["missing_evidence"], list)
    assert "Access Control" in result["section_breakdown"]
    assert all(isinstance(v, dict) for v in result["section_breakdown"].values())
    assert isinstance(result["explainability_notes"], list)
    assert any("Access Control" in note for note in result["explainability_notes"])

def test_medium_risk_case():
    payload = load_payload("medium_risk.json")
    result = calculate_risk(payload)

    assert result["risk_tier"] == "Medium" 
    assert result["final_score"] >= 25  
    assert isinstance(result["red_flags_triggered"], list)
    assert isinstance(result["missing_evidence"], list)
    assert "Data Protection" in result["section_breakdown"]
    assert all(isinstance(v, dict) for v in result["section_breakdown"].values())
    assert isinstance(result["explainability_notes"], list)

def test_high_risk_case():
    payload = load_payload("high_risk.json")
    result = calculate_risk(payload)

    assert result["risk_tier"] == "High"
    assert result["final_score"] > 55  
    assert isinstance(result["red_flags_triggered"], list)
    assert isinstance(result["missing_evidence"], list)
    assert "Incident Response" in result["section_breakdown"]
    assert all(isinstance(v, dict) for v in result["section_breakdown"].values())
    assert isinstance(result["explainability_notes"], list)

def test_red_flag_forces_high_risk():
    payload = load_payload("low_risk.json")
    for section in payload["sections"]:
        for q in section.get("questions", []):
            if q["id"] == "AC_02":  # Example red flag question from config
                q["answer"] = "No"  # This triggers a red flag per config

    result = calculate_risk(payload)
    assert result["risk_tier"] == "High"
    assert "AC_02" in result["red_flags_triggered"]

def test_missing_evidence_detection():
    payload = load_payload("medium_risk.json")
    result = calculate_risk(payload)

    assert len(result["missing_evidence"]) > 0
    for qid in result["missing_evidence"]:
        found = False
        for section in payload["sections"]:
            for q in section.get("questions", []):
                if q["id"] == qid:
                    found = q.get("requires_evidence", False)
        assert found, f"Question {qid} marked missing evidence but doesn't require it."

def test_validate_payload_raises_error():
    payload = load_payload("low_risk.json")
    for section in payload["sections"]:
        for q in section.get("questions", []):
            if q.get("mandatory"):
                q["answer"] = None
                break
        break

    with pytest.raises(ValueError):
        validate_payload(payload)
