# VRM Engine – Architecture Overview

This repository contains the Vendor Risk Management (VRM) scoring engine
and its integration with the Django-based VRM platform.

The scoring logic is intentionally separated from Django and implemented
as an independent FastAPI service to ensure scalability, explainability,
and future reuse.

---

## High-Level Architecture

Django (VRM Platform)
        |
        | HTTP (REST)
        v
FastAPI Scoring Service
        |
   JSON-based Rules

---

## Why FastAPI as a Separate Service?

The scoring engine is implemented as a **separate FastAPI service** instead
of a Django app for the following reasons:

- Clear separation of concerns
- Independent scaling of scoring logic
- Language-agnostic service (future extensibility)
- Easier rule experimentation and explainability
- Can be reused by other systems beyond Django

Django communicates with the scoring service over HTTP using a thin wrapper.

---

## Repository Structure

VRM_ENGINE
├── vrm_scoring_engine # Scoring Service (FastAPI)
│   ├── __pycache__/
│   ├── sample_payloads/ #Sample payloads for low, medium and high risk
│   ├── scoring_engine/ #Core scoring logic and rules loader
│   ├── tests/
│   ├── api.py  #FastAPI app with /score, /validate, /rules endpoints
│   ├── README.md
│   └── requirements.txt
└── vrm_django_wrapper #Django project wrapper
    ├── services_wrapper  # Django app containing scoring client & integration
    │   ├── __pycache__/
    │   ├── migrations/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── scoring_client.py # Client to call scoring service endpoints
    │   ├── tests.py
    │   ├── urls.py
    │   └── views.py
    ├── venv/
    ├── vrm_django_wrapper/
    ├── db.sqlite3
    └── manage.py



## Responsibilities

- **Scoring Engine**: Computes risk score, tiers, red flags, explainability
- **Django Wrapper**: Calls scoring service at defined workflow points
- **Rules**: Loaded from JSON (DB-ready in future)
- **Scoring Trigger Ownership**:
  Scoring is triggered by the Django backend on:
  - Reviewer approval
  - Remediation closure approval (if applicable)

## API Contract Versioning

The scoring service follows a **versioned API contract (v1)**.

All endpoints exposed under `/v1/*` are considered **stable**.
Breaking changes will only be introduced via a new version (v2).
