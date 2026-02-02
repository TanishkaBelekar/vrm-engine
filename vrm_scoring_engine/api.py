from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any

from scoring_engine.engine import calculate_risk
from scoring_engine.config_loader import load_config

app = FastAPI(
    title="Risk Scoring Engine API",
    version="v1"
)

# Load config once (config lock)
config = load_config()
CONFIG_VERSION = config.get("version", "v1")


# -------------------------
# Pydantic Models
# -------------------------

class SectionScore(BaseModel):
    raw_score: float
    weighted_score: float


class ScoreRequest(BaseModel):
    template_id: Optional[str] = None
    version: Optional[str] = None
    sections: List[Dict[str, Any]]
    section_weights: Optional[Dict[str, int]] = None


class ScoreResponse(BaseModel):
    final_score: float
    risk_tier: str
    red_flags_triggered: List[Any]
    missing_evidence: List[str]
    section_breakdown: Dict[str, SectionScore]
    explainability_notes: List[str]


# -------------------------
# Helper: Strict Validation
# -------------------------

def validate_contract(request: ScoreRequest):
    # Enforce API version
    if request.version and request.version != CONFIG_VERSION:
        raise HTTPException(
            status_code=409,
            detail=f"Unsupported scoring version: {request.version}"
        )

    if not request.sections or not isinstance(request.sections, list):
        raise HTTPException(
            status_code=400,
            detail="Payload must contain a non-empty 'sections' list"
        )

    for section in request.sections:
        if "name" not in section or "questions" not in section:
            raise HTTPException(
                status_code=400,
                detail="Each section must contain 'name' and 'questions'"
            )

        if not isinstance(section["questions"], list):
            raise HTTPException(
                status_code=400,
                detail="Section 'questions' must be a list"
            )

        for q in section["questions"]:
            if "id" not in q:
                raise HTTPException(
                    status_code=400,
                    detail="Each question must contain 'id'"
                )

            if q.get("mandatory") and not q.get("answer"):
                raise HTTPException(
                    status_code=400,
                    detail=f"Mandatory question not answered: {q['id']}"
                )


# -------------------------
# v1 APIs
# -------------------------

@app.post("/v1/score", response_model=ScoreResponse)
async def score(request: ScoreRequest):
    """
    Calculate risk score for an assessment.
    Contract version: v1 (frozen)
    """
    try:
        validate_contract(request)

        payload = {
            "template_id": request.template_id,
            "version": CONFIG_VERSION,
            "sections": request.sections,
        }

        weights = request.section_weights or config.get("section_weights")

        result = calculate_risk(
            assessment_payload=payload,
            section_weights=weights
        )

        # Convert section breakdown to Pydantic model
        result["section_breakdown"] = {
            section: SectionScore(**scores)
            for section, scores in result.get("section_breakdown", {}).items()
        }

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Scoring failed: {str(e)}"
        )


@app.post("/v1/validate")
async def validate(request: ScoreRequest):
    """
    Validate payload without scoring.
    Contract version: v1 (frozen)
    """
    try:
        validate_contract(request)

        missing_evidence = []
        errors = []

        for section in request.sections:
            for q in section.get("questions", []):
                qid = q.get("id")

                if q.get("mandatory") and not q.get("answer"):
                    errors.append(f"Mandatory question {qid} is not answered")

                if q.get("requires_evidence") and not q.get("evidence_uploaded", False):
                    missing_evidence.append(qid)

        return {
            "valid": len(errors) == 0 and len(missing_evidence) == 0,
            "missing_evidence": missing_evidence,
            "errors": errors
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Validation failed: {str(e)}"
        )

@app.get("/v1/rules")
def get_rules():
    rules = load_config()

    return {
        "rules": rules
    }



@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "vrm-scoring-engine",
        "version": CONFIG_VERSION
    }





