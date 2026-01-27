from scoring_engine.config_loader import load_config

config = load_config()
RED_FLAG_RULES = config.get("red_flag_rules", {})

def detect_red_flags(sections: list) -> list:
    triggered = set()   # prevents duplicates

    for section in sections:
        for q in section.get("questions", []):
            qid = q.get("id")
            answer = q.get("answer")

            if qid in RED_FLAG_RULES and answer in RED_FLAG_RULES[qid]:
                triggered.add(qid)

    return list(triggered)
