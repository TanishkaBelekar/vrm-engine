import json
from pathlib import Path

def load_rules():
    rules_path = Path(__file__).parent.parent / "config.json"
    with open(rules_path, "r") as f:
        return json.load(f)

def get_answer_score(answer: str, answer_scores: dict) -> int:
    return answer_scores.get(answer, 0)

