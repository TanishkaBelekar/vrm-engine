from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from scoring_engine.engine import calculate_risk
from scoring_engine.config_loader import load_config

app = FastAPI(title="Risk Scoring Engine API")

# Load config once
config = load_config()

class SectionScore(BaseModel):
    raw_score: float
    weighted_score: float

class ScoreRequest(BaseModel):
    template_id: Optional[str]
    version: Optional[str]
    sections: List[Dict[str, Any]]
    section_weights: Optional[Dict[str, int]] = None 

class ScoreResponse(BaseModel):
    final_score: float
    risk_tier: str
    red_flags_triggered: List[str]
    missing_evidence: List[str]
    section_breakdown: Dict[str, SectionScore] 
    explainability_notes: List[str]

@app.post("/score", response_model=ScoreResponse)
async def score(request: ScoreRequest):
    try:
        payload = {
            "template_id": request.template_id,
            "version": request.version,
            "sections": request.sections,
        }

        weights = request.section_weights or config.get("section_weights")

        result = calculate_risk(payload, section_weights=weights)

        
        result["section_breakdown"] = {
            section: SectionScore(**scores)
            for section, scores in result.get("section_breakdown", {}).items()
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/validate")
async def validate(request: ScoreRequest):
    missing_evidence = []
    errors = []

    sections = request.sections

    for section in sections:
        questions = section.get("questions", [])
        for q in questions:
            qid = q.get("id")
            answer = q.get("answer")
            requires_evidence = q.get("requires_evidence", False)
            mandatory = q.get("mandatory", False)

            if mandatory and (answer is None or answer == ""):
                errors.append(f"Mandatory question {qid} is not answered.")

            if requires_evidence and not q.get("evidence_uploaded", False):
                missing_evidence.append(qid)

    valid = (len(errors) == 0 and len(missing_evidence) == 0)

    return {
        "valid": valid,
        "missing_evidence": missing_evidence,
        "errors": errors
    }

@app.get("/rules")
async def get_rules():
    return {
        "section_weights": config.get("section_weights", {}),
        "red_flag_rules": config.get("red_flag_rules", {})
    }
