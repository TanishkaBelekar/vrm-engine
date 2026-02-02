# VRM Scoring Engine (FastAPI Service)

## Overview
This service provides vendor risk scoring as a **standalone FastAPI microservice**.
It is intentionally kept **separate from Django** so it can be scaled, containerized,
and reused independently.

This service is consumed by the Django VRM application via HTTP APIs.

---

## Architecture Decision
**FastAPI used as a separate service**  
Not embedded inside Django

Reason:
- Faster computation
- Clear service boundaries
- Easy Dockerization
- Future scalability (can be DB-backed later)

---

## Service Port
- **FastAPI Scoring Service** → `8001`

---

## API Endpoints (Stable Contract)

| Method | Endpoint   | Description |
|------|-----------|-------------|
| POST | `/v1/score`   | Calculate final risk score |
| POST | `/v1/validate`| Validate payload & mandatory evidence |
| GET  | `/v1/rules`   | Fetch scoring rules & weights |
| GET  | `/health`     | Service liveness check

---

## Scoring Output Includes
- `final_score`
- `risk_tier`
- `red_flags_triggered`
- `missing_evidence`
- `section_breakdown` (weighted)
- `explainability_notes` (human-readable)

---


## Rules Configuration

Scoring rules (weights, red flags, mandatory evidence) are loaded from a single JSON config file.
This allows future migration to database-backed rules without API changes.




## Running the Service (Local – without Docker)

```bash
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8001 --reload

Service will be available at:
http://127.0.0.1:8001
```


## Running with Docker 
```bash
docker build -t vrm_scoring_engine .
docker run -p 8001:8001 vrm_scoring_engine
```

## CURL Examples
1. Score Vendor Assessment
```bash
curl -X POST http://127.0.0.1:8001/v1/score -H "Content-Type: application/json" -d @sample_payloads/high_risk.json

Sample Response
{
  "final_score": 77.49,
  "risk_tier": "High",
  "red_flags_triggered": ["IR_01", "AC_02"],
  "section_breakdown": {
    "Access Control": { "weighted_score": 17.78 }
  },
  "explainability_notes": [
    "Section 'Access Control' contributed 17.78 risk points."
  ]
}


2. Validate Payload
curl -X POST http://127.0.0.1:8001/v1/validate -H "Content-Type: application/json" -d @sample_payloads/high_risk.json

Sample Response
{
  "valid": false,
  "missing_evidence": [
    "AC_02",
    "AC_04",
    "DP_06",
    "IR_01",
    "IR_04",
    "IR_06",
    "VM_03",
    "VM_05",
    "BCP_01",
    "BCP_02",
    "BCP_04",
    "COMP_01",
    "COMP_03",
    "OPS_01",
    "SUB_02"
  ],
  "errors": []
}

3. Fetching Scoring Rules
curl http://127.0.0.1:8001/v1/rules

Sample Response 
{
  "section_weights": {
    "Access Control": 20,
    "Data Protection": 15,
    "Incident Response": 10,
    "Vulnerability Management": 10,
    "BCP/DR": 10,
    "Compliance": 10,
    "Operations": 15,
    "Sub-processors": 10
  },
  "red_flag_rules": {
    "AC_02": ["No"],
    "AC_03": ["No"],
    "DP_07": ["Yes"],
    "IR_01": ["No"],
    "IR_06": ["No"],
    "VM_01": ["No", "Partial"],
    "VM_02": ["No"],
    "COMP_05": ["Yes"],
    "SUB_05": ["No"]
  }
}
```

## Sample Payloads

## Low Risk Payload
```bash
{
  "template_id": "low_risk_template",
  "version": "v1",
  "sections": [
    {
      "name": "Access Control",
      "questions": [
        {"id": "AC_01", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "AC_02", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_03", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "AC_04", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_05", "answer": "Monitoring enabled", "mandatory": false, "requires_evidence": false, "type": "multiple_choice", "evidence_uploaded": false},
        {"id": "AC_06", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "AC_07", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "AC_08", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "AC_09", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "Data Protection",
      "questions": [
        {"id": "DP_01", "answer": "AES-256 Encryption", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "DP_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "DP_03", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "DP_04", "answer": "Formal procedures in place", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "DP_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "DP_06", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "DP_07", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "DP_08", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "Incident Response",
      "questions": [
        {"id": "IR_01", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "IR_02", "answer": "Reporting process documented", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "IR_03", "answer": "Notification process documented", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "IR_04", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "IR_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "IR_06", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true}
      ]
    },
    {
      "name": "Vulnerability Management",
      "questions": [
        {"id": "VM_01", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "VM_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "VM_03", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "VM_04", "answer": "Tools used", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "VM_05", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "VM_06", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "BCP/DR",
      "questions": [
        {"id": "BCP_01", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "BCP_02", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "BCP_03", "answer": "Regular testing", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "BCP_04", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "BCP_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "BCP_06", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "Compliance",
      "questions": [
        {"id": "COMP_01", "answer": "Compliant", "mandatory": true, "requires_evidence": true, "type": "text", "evidence_uploaded": true},
        {"id": "COMP_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "COMP_03", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "COMP_04", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "COMP_05", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "Operations",
      "questions": [
        {"id": "OPS_01", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "OPS_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "OPS_03", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "OPS_04", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "OPS_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "Sub-processors",
      "questions": [
        {"id": "SUB_01", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "SUB_02", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "SUB_03", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "SUB_04", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "SUB_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    }
  ]
}
```

## Medium Risk payload
```bash
{
  "template_id": "medium_risk_template",
  "version": "v1",
  "sections": [
    {
      "name": "Access Control",
      "questions": [
        {"id": "AC_01", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_02", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_03", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},  
        {"id": "AC_04", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_05", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "multiple_choice", "evidence_uploaded": false},
        {"id": "AC_06", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_07", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},  
        {"id": "AC_08", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "AC_09", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true}
      ]
    },
    {
      "name": "Data Protection",
      "questions": [
        {"id": "DP_01", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "DP_02", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}, 
        {"id": "DP_03", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "DP_04", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": true},
        {"id": "DP_05", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},  
        {"id": "DP_06", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "DP_07", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "DP_08", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true}
      ]
    },
    {
      "name": "Incident Response",
      "questions": [
        {"id": "IR_01", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "IR_02", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "IR_03", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},  
        {"id": "IR_04", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "IR_05", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "IR_06", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true}
      ]
    },
    {
      "name": "Vulnerability Management",
      "questions": [
        {"id": "VM_01", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "VM_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "VM_03", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},  
        {"id": "VM_04", "answer": "We use Nessus", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": true},
        {"id": "VM_05", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "VM_06", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "BCP/DR",
      "questions": [
        {"id": "BCP_01", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "BCP_02", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},  
        {"id": "BCP_03", "answer": "Quarterly", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
        {"id": "BCP_04", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true}, 
        {"id": "BCP_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "BCP_06", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
      ]
    },
    {
      "name": "Compliance",
      "questions": [
        {"id": "COMP_01", "answer": "GDPR", "mandatory": true, "requires_evidence": true, "type": "text", "evidence_uploaded": true},  
        {"id": "COMP_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "COMP_03", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "COMP_04", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},  
        {"id": "COMP_05", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true}  
      ]
    },
    {
      "name": "Operations",
      "questions": [
        {"id": "OPS_01", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},  
        {"id": "OPS_02", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "OPS_03", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "OPS_04", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},  
        {"id": "OPS_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true}
      ]
    },
    {
      "name": "Sub-processors",
      "questions": [
        {"id": "SUB_01", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
        {"id": "SUB_02", "answer": "Yes", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": true},
        {"id": "SUB_03", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},  
        {"id": "SUB_04", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true},
        {"id": "SUB_05", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": true}  
      ]
    }
  ]
}
```

## High Risk Payload
```bash
{
  "template_id": "high_risk_template",
  "version": "v1",
  
    "sections": [
      {
        "name": "Access Control",
        "questions": [
          {"id": "AC_01", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_02", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_03", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_04", "answer": "Partial", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_05", "answer": "No monitoring", "mandatory": false, "requires_evidence": false, "type": "multiple_choice", "evidence_uploaded": false},
          {"id": "AC_06", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_07", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_08", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "AC_09", "answer": "Partial", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "Data Protection",
        "questions": [
          {"id": "DP_01", "answer": "No encryption", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "DP_02", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "DP_03", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "DP_04", "answer": "No formal procedures", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "DP_05", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "DP_06", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "DP_07", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "DP_08", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "Incident Response",
        "questions": [
          {"id": "IR_01", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "IR_02", "answer": "No reporting process", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "IR_03", "answer": "No notification process", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "IR_04", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "IR_05", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "IR_06", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "Vulnerability Management",
        "questions": [
          {"id": "VM_01", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "VM_02", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "VM_03", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "VM_04", "answer": "No tools used", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "VM_05", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "VM_06", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "BCP/DR",
        "questions": [
          {"id": "BCP_01", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "BCP_02", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "BCP_03", "answer": "No testing", "mandatory": false, "requires_evidence": false, "type": "text", "evidence_uploaded": false},
          {"id": "BCP_04", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "BCP_05", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "BCP_06", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "Compliance",
        "questions": [
          {"id": "COMP_01", "answer": "None", "mandatory": true, "requires_evidence": true, "type": "text", "evidence_uploaded": false},
          {"id": "COMP_02", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "COMP_03", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "COMP_04", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "COMP_05", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "Operations",
        "questions": [
          {"id": "OPS_01", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "OPS_02", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "OPS_03", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "OPS_04", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "OPS_05", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      },
      {
        "name": "Sub-processors",
        "questions": [
          {"id": "SUB_01", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "SUB_02", "answer": "No", "mandatory": true, "requires_evidence": true, "type": "choice", "evidence_uploaded": false},
          {"id": "SUB_03", "answer": "Yes", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "SUB_04", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false},
          {"id": "SUB_05", "answer": "No", "mandatory": false, "requires_evidence": false, "type": "choice", "evidence_uploaded": false}
        ]
      }
    ]
  
}
```


---

## Failure Handling & Timeouts (Django Integration Guidance)

If the scoring service is unavailable or times out:

- Django should call the scoring service with a **2-second timeout**
- Retry **once** if a timeout or 5xx error occurs
- If retry fails:
  - Block assessment submission
  - Return a safe error to UI:  
    `"Scoring service temporarily unavailable. Please try again later."`
- No partial or cached score should be used
- Assessment state should remain unchanged

This ensures scoring consistency and avoids incorrect risk decisions.



## Schema Validation & Error Handling

The scoring service performs strict input validation before scoring.

If the request payload is invalid, the service returns a clear and structured error response.
No partial or cached score is ever returned.

## Example Validation Error Response

```json
{
  "error": "Invalid scoring payload",
  "details": [
    "Missing mandatory question: AC_02",
    "Evidence required for question IR_01 but not provided",
    "Invalid answer value for VM_03 (allowed: Yes / No / Partial)"
  ]
}
```

## Scoring Payload Contract
```json
{
  "template_id": "string",
  "version": "v1",
  "sections": [
    {
      "name": "Access Control",
      "questions": [
        {
          "id": "AC_02",
          "answer": "Yes | No | Partial | text",
          "mandatory": true,
          "requires_evidence": true,
          "evidence_uploaded": true,
          "type": "choice | text | multiple_choice"
        }
      ]
    }
  ]
}
```


## Scoring Result Contract (Persisted by Django)
```json
{
  "final_score": 77.49,
  "risk_tier": "High",
  "red_flags_triggered": ["AC_02", "IR_01"],
  "missing_evidence": ["DP_06"],
  "section_breakdown": {
    "Access Control": {
      "raw_score": 20,
      "weighted_score": 17.78
    }
  },
  "explainability_notes": [
    "Access Control contributed 17.78 risk points due to missing MFA."
  ],
  "scored_at": "2026-02-02T10:15:30Z",
  "template_version": "v1"
}
```


## Running the Scoring Service (Docker)

### Environment Variables
- `SCORING_CONFIG_PATH=config.json`  
  Path to the scoring rules configuration file.
- `SCORING_TIMEOUT_SECONDS=5`  
  Timeout in seconds for scoring requests.

### Run
docker build -t vrm-scoring-engine .
docker run -p 8001:8001 vrm-scoring-engine

### Health Check
GET /health 

### Timeout / Retry Guidance
- Client timeout: 3–5 seconds
- Retry: max 2 retries on network failure
- Do NOT retry on HTTP 400 (payload errors)


## Scoring Trigger Rules:
- Initial score is generated only after reviewer approval.
- If remediation exists:
  - Re-score only after remediation approval.
  