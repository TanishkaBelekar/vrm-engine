from typing import Dict, Any
from scoring_engine.config_loader import load_config
from scoring_engine.rules import get_answer_score
from scoring_engine.red_flag import detect_red_flags


config = load_config()

SECTION_WEIGHTS = config["section_weights"]
RISK_THRESHOLDS = config["risk_thresholds"]
ANSWER_SCORES = config["answer_scores"]


def load_rules(config_path: str = "config.json") -> dict:
    """
    Load the scoring rules/config from JSON file.
    """
    return load_config(config_path)


def validate_payload(payload: dict) -> bool:
    """
    Validate the structure and required fields of the assessment payload.
    Raises ValueError on validation failure.
    """
    if not isinstance(payload, dict):
        raise ValueError("Payload must be a dictionary")

    sections = payload.get("sections")
    if not sections or not isinstance(sections, list):
        raise ValueError("Payload must contain a 'sections' list")

    for section in sections:
        if "name" not in section or "questions" not in section:
            raise ValueError("Each section must have 'name' and 'questions' keys")

        if not isinstance(section["questions"], list):
            raise ValueError("Section 'questions' must be a list")

        for q in section["questions"]:
            if "id" not in q:
                raise ValueError("Each question must have an 'id' key")

            if q.get("mandatory") and not q.get("answer"):
                raise ValueError(f"Mandatory question not answered: {q['id']}")

    return True


def calculate_risk(
    assessment_payload: dict,
    section_weights: dict = SECTION_WEIGHTS,
    risk_thresholds: dict = RISK_THRESHOLDS
) -> Dict[str, Any]:
    """
    Calculate risk score and tier from assessment payload.

    Returns a dict with:
    - final_score: float
    - risk_tier: str ("Low", "Medium", "High")
    - red_flags_triggered: list of question IDs
    - missing_evidence: list of question IDs missing evidence
    - section_breakdown: dict of section scores
    - explainability_notes: list of strings explaining scoring
    """

    final_score = 0.0
    section_scores = {}
    missing_evidence_questions = []
    explainability_notes = []

    sections = assessment_payload.get("sections", [])

    # Detect red flags
    red_flag_questions = detect_red_flags(sections)

    for section in sections:
        section_name = section.get("name")
        questions = section.get("questions", [])

        weight = section_weights.get(section_name, 0)
        section_raw_score = 0
        max_possible_score = len(questions) * 2  

        for q in questions:
            if q.get("mandatory") and not q.get("answer"):
                raise ValueError(f"Mandatory question not answered: {q['id']}")

            if q.get("requires_evidence") and not q.get("evidence_uploaded", False):
                missing_evidence_questions.append(q["id"])

            if q.get("type") == "text":
                continue

            section_raw_score += get_answer_score(q.get("answer"), ANSWER_SCORES)

        section_weighted_score = (
            (section_raw_score / max_possible_score) * weight
            if max_possible_score > 0 else 0
        )

        section_scores[section_name] = {
            "raw_score": section_raw_score,
            "weighted_score": round(section_weighted_score, 2)
        }

        final_score += section_weighted_score

        explainability_notes.append(
            f"Section '{section_name}' contributed {round(section_weighted_score, 2)} risk points."
        )

    for qid in red_flag_questions:
        explainability_notes.append(f"Red flag triggered by question {qid}.")

    for qid in missing_evidence_questions:
        explainability_notes.append(f"Evidence missing for question {qid}.")

   
    if red_flag_questions:
        risk_tier = "High"
    elif final_score <= risk_thresholds["low"]:
        risk_tier = "Low"
    elif final_score < risk_thresholds["medium"]:
        risk_tier = "Medium"
    else:
        risk_tier = "High"

    return {
        "final_score": round(final_score, 2),
        "risk_tier": risk_tier,
        "red_flags_triggered": red_flag_questions,
        "missing_evidence": missing_evidence_questions,
        "section_breakdown": section_scores,
        "explainability_notes": explainability_notes
    }
