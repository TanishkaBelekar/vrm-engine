# VRM Scoring Engine Service

This folder contains the **Scoring Engine** service implemented with FastAPI.

---

## Overview

The Scoring Engine provides APIs to:

- Calculate risk scores (`POST /score`)
- Validate input payloads (`POST /validate`)
- Retrieve active scoring rules (`GET /rules`)

---

## Setup Instructions

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

2. Install dependenceis:
```bash
pip install -r requirements.txt

3. Run the FastAPI server:
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8001


## API Endpoints
-POST /score – Get scoring result from input payload.

-POST /validate – Validate mandatory questions and evidence completeness.

-GET /rules – Retrieve active scoring and red-flag rules.


## Sample Payloads
Sample JSON payloads for testing are available in the sample_payloads/ directory.



Note: Ensure the scoring engine is running before making requests from the Django wrapper or other clients.