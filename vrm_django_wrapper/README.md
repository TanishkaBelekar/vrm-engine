# VRM Django Scoring Wrapper

This Django project acts as an integration layer (wrapper) for the **FastAPI-based VRM Scoring Engine**.

It enables your Django app to communicate with the standalone scoring service to calculate and validate risk scores during key VRM workflow events.

---

##  Tech Stack

- Python 3.11  
- Django  
- Django REST Framework  
- Requests (for HTTP communication with the scoring service)

---

## 🔌 Ports Used

- **Django app runs on:** `http://127.0.0.1:8000`  
- **FastAPI scoring service runs on:** `http://127.0.0.1:8001`

---

##  Setup Instructions

### 1️ Create and activate a Python virtual environment (recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2 Install dependencies
```bash
pip install -r requirements.txt
```

### 3 Run database migrations
```bash
python manage.py migrate
```

### 4 Start Django development server
```bash
python manage.py runserver
```


### How integration works

The scoring engine service lives separately as a FastAPI app.

The Django wrapper calls it via HTTP using the helper functions defined in:
```bash
services_wrapper/scoring_client.py
```
This client handles requests to:

/v1/score — to calculate risk scores  
/v1/validate — to validate assessments  
/v1/rules — to fetch scoring rules



### When Is Scoring Called?

Scoring is triggered by the Django backend at the following points:

- Reviewer approves an assessment
- After remediation is closed and approved (if remediation was required)

Scoring is NOT triggered on draft saves.



## Scoring Persistence (Django)

The scoring service returns:
- final_score
- risk_tier
- red_flags_triggered
- section_breakdown
- explainability_notes

Django is expected to persist these fields per vendor review
along with:
- scored_at
- template_version




## Canonical Backend Wiring & Verification (Scoring Integration)

This Django wrapper serves as a **reference integration layer** for the FastAPI-based VRM Scoring Engine.  
The actual workflow wiring and event triggering is implemented in the **canonical backend**.

### Scoring Trigger Rules

The canonical backend must trigger scoring **only** at the following workflow stages:

- **Final reviewer approval** of a vendor assessment
- **Remediation approval**, if remediation was required

Scoring must **not** be triggered on:
- Draft save
- Initial submission
- Reviewer comments or intermediate state transitions

### Scoring Service Invocation

The canonical backend should invoke the scoring service using:

```http
POST /v1/score
```

### Verification Steps (Postman / Swagger)

After integration, verify scoring using the following checklist:

1. **Ensure scoring service is running and healthy**
   - `GET /health` → HTTP 200

2. **Trigger final review approval in the canonical backend**
   - Confirm `POST /v1/score` is called once
   - Verify scoring response is persisted

3. **Trigger remediation approval (if applicable)**
   - Confirm scoring is re-executed
   - Verify updated score persistence

4. **Confirm scoring is NOT triggered on**
   - Draft save
   - Initial submission
   - Reviewer comments
