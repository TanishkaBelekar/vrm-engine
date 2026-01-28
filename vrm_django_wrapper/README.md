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

/score endpoint — to calculate risk scores

/validate endpoint — to validate assessments

/rules endpoint — to fetch scoring rules



### When Is Scoring Called?
The scoring service is triggered at key business events such as: <br>
   -Vendor submitting an assessment <br>
   -Reviewer approving the assessment <br>
   -Closing remediation <br>
This ensures risk scores are accurate and up-to-date throughout the VRM lifecycle.