from django.test import TestCase

import requests
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


"""
Scoring Trigger Rules:
1. Score runs when reviewer submits final review.
2. If remediation occurs, re-scoring happens ONLY after remediation is approved.
3. Scoring failure blocks approval (safe-fail).
"""



logger = logging.getLogger(__name__)

BASE_URL = "http://127.0.0.1:8001/v1"   # Change if deployed elsewhere
TIMEOUT = 5  # seconds

# --- Session with retry strategy ---
session = requests.Session()

retry_strategy = Retry(
    total=3,                      # total retries
    backoff_factor=0.5,            # wait: 0.5s, 1s, 2s
    status_forcelist=[500, 502, 503, 504],
    allowed_methods=["POST", "GET"]
)

adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)


class ScoringServiceError(Exception):
    """Raised when scoring service is unavailable or returns invalid response"""
    pass


def validate(payload: dict) -> dict:
    """
    Call the /validate endpoint of scoring service.
    Raises ScoringServiceError on failure.
    """
    try:
        response = session.post(
            f"{BASE_URL}/validate",
            json=payload,
            timeout=TIMEOUT
        )
        response.raise_for_status()
        return response.json()

    except requests.RequestException as e:
        logger.exception("Scoring validation failed")
        raise ScoringServiceError("Validation service unavailable") from e


def score(payload: dict) -> dict:
    """
    Call the /score endpoint of scoring service.
    Raises ScoringServiceError on failure.
    """
    try:
        response = session.post(
            f"{BASE_URL}/score",
            json=payload,
            timeout=TIMEOUT
        )
        response.raise_for_status()
        return response.json()

    except requests.RequestException as e:
        logger.exception("Scoring request failed")
        raise ScoringServiceError("Scoring service unavailable") from e


def get_rules() -> dict:
    """
    Call the /rules endpoint of scoring service.
    Raises ScoringServiceError on failure.
    """
    try:
        response = session.get(
            f"{BASE_URL}/rules",
            timeout=TIMEOUT
        )
        response.raise_for_status()
        return response.json()

    except requests.RequestException as e:
        logger.exception("Fetching scoring rules failed")
        raise ScoringServiceError("Rules service unavailable") from e
