from scoring_engine.engine import calculate_risk, validate_payload
from scoring_engine.config_loader import load_config
import pytest

config = load_config()
RED_FLAG_RULES = config.get("red_flag_rules", {})

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

def test_scoring_is_deterministic():
    result_1 = calculate_risk(valid_payload)
    result_2 = calculate_risk(valid_payload)

    assert result_1["final_score"] == result_2["final_score"]
    assert result_1["risk_tier"] == result_2["risk_tier"]
    assert result_1.get("red_flags_triggered") == result_2.get("red_flags_triggered")

def test_red_flag_forces_high_risk():
    # Example test for one red flag condition
    payload = {
        "sections": [
            {
                "name": "Access Control",
                "questions": [
                    {
                        "id": "AC_02",
                        "answer": "No",
                        "mandatory": True,
                        "requires_evidence": True,
                        "evidence_uploaded": False
                    }
                ]
            }
        ]
    }
    result = calculate_risk(payload)
    assert "AC_02" in result.get("red_flags_triggered", [])
    assert result["risk_tier"] == "High"

def test_red_flag_override_triggers_all():
    assert RED_FLAG_RULES, "No red_flag_rules defined in config"

    for qid, flagged_answers in RED_FLAG_RULES.items():
        for answer in flagged_answers:
            payload = {
                "sections": [
                    {
                        "name": "Access Control",
                        "questions": [
                            {
                                "id": qid,
                                "answer": answer,
                                "mandatory": True,
                                # Setting evidence_uploaded False to simulate risk
                                "requires_evidence": True,
                                "evidence_uploaded": False
                            }
                        ]
                    }
                ]
            }

            result = calculate_risk(payload)

            assert qid in result.get("red_flags_triggered", []), f"Red flag {qid} not triggered for answer {answer}"
            assert result["risk_tier"] == "High", f"Risk tier not High for red flag {qid}"
