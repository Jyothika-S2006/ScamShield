import os
from fastapi import FastAPI
from pydantic import BaseModel
import requests
from supabase import create_client, Client

app = FastAPI()

# Credentials (We will fill these in Step 2 later)
HF_MODEL_URL = "https://api-inference.huggingface.co/models/YOUR_USERNAME/scamshield-muril"
HF_TOKEN = os.getenv("HF_TOKEN", "")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

class ScanRequest(BaseModel):
    user_id: str = "anonymous"
    text: str

EXPLANATIONS = {
    "urgency": "This message uses urgent language to pressure quick action - a common scam tactic.",
    "link": "This message contains a suspicious or shortened link.",
    "high_risk": "Our AI model flagged this message as high risk based on language patterns.",
    "safe": "No scam patterns detected.",
}

def check_url_heuristics(text: str) -> bool:
    shorteners = ["bit.ly", "tinyurl", "t.co", "cutt.ly"]
    return any(s in text.lower() for s in shorteners)

def check_urgency(text: str) -> bool:
    urgency_words = ["urgent", "immediately", "expire", "blocked", "act now", "verify now"]
    return any(w in text.lower() for w in urgency_words)

@app.post("/scan")
def scan_message(req: ScanRequest):
    text = req.text
    has_link_risk = check_url_heuristics(text)
    has_urgency = check_urgency(text)

    headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
    
    try:
        response = requests.post(HF_MODEL_URL, headers=headers, json={"inputs": text}, timeout=10)
        model_result = response.json()
        if response.status_code == 200 and isinstance(model_result, list):
            scam_score = model_result[0][1].get("score", 0.5) if len(model_result[0]) > 1 else model_result[0][0].get("score", 0.5)
        else:
            scam_score = 0.5
    except Exception:
        scam_score = 0.5

    final_score = scam_score
    if has_link_risk:
        final_score = min(1.0, final_score + 0.15)
    if has_urgency:
        final_score = min(1.0, final_score + 0.1)

    if final_score > 0.7:
        action = "Block"
        explanation = EXPLANATIONS["high_risk"]
    elif final_score > 0.4:
        action = "Verify"
        explanation = EXPLANATIONS["urgency"] if has_urgency else EXPLANATIONS["link"]
    else:
        action = "Safe"
        explanation = EXPLANATIONS["safe"]

    rounded_score = round(final_score, 2)

    if supabase:
        try:
            supabase.table("scan_logs").insert({
                "user_id": req.user_id,
                "message_text": text,
                "score": rounded_score,
                "action": action
            }).execute()
        except Exception as e:
            print(f"Supabase Log Error: {e}")

    return {
        "score": rounded_score,
        "action": action,
        "explanation": explanation
    }