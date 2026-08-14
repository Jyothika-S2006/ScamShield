from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

# Jyothika's Public MuRIL Model Endpoint
HF_API_URL = "https://api-inference.huggingface.co/models/JyothikaShanmugam/scamshield-muril"

class ScanRequest(BaseModel):
    user_id: str = "anonymous"
    text: str

def analyze_text_with_hf(text: str):
    try:
        response = requests.post(HF_API_URL, json={"inputs": text}, timeout=10)
        result = response.json()
        
        # Parse Hugging Face model response
        if isinstance(result, list) and len(result) > 0:
            predictions = result[0]
            top_pred = max(predictions, key=lambda x: x.get('score', 0))
            return top_pred.get('score', 0.5), top_pred.get('label', 'UNKNOWN')
    except Exception as e:
        print(f"Hugging Face API Error: {e}")
    
    return 0.5, "UNKNOWN"

@app.get("/")
def home():
    return {"message": "ScamShield Backend Engine Running"}

@app.post("/scan")
def scan_message(payload: ScanRequest):
    text = payload.text.lower()
    
    # 1. Heuristic Checks
    has_link = any(pattern in text for pattern in ["http", "bit.ly", "t.co", ".com", ".in"])
    has_urgency = any(word in text for word in ["urgent", "verify", "blocked", "account", "suspend", "upi", "pin", "winner"])
    
    # 2. Query MuRIL Model
    model_score, model_label = analyze_text_with_hf(payload.text)
    
    # 3. Decision Logic
    is_scam = has_link or has_urgency or model_score > 0.7 or "1" in str(model_label)
    
    if is_scam:
        action = "Block & Alert" if (has_link and has_urgency) else "Verify Carefully"
        explanation = f"Flagged by MuRIL AI model ({model_label}) or heuristic rule detection."
        risk_score = max(0.85, model_score)
    else:
        action = "Safe"
        explanation = "No scam patterns detected."
        risk_score = min(0.2, model_score)

    return {
        "score": round(risk_score, 2),
        "action": action,
        "explanation": explanation,
        "model_label": model_label
    }