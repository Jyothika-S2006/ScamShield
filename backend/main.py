from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import BertTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI(title="ScamShield Backend", version="1.0.0")

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model directly on server startup
MODEL_NAME = "JyothikaShanmugam/scamshield-muril"
tokenizer = BertTokenizer.from_pretrained("google/muril-base-cased")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

class ScanRequest(BaseModel):
    text: str
    user_id: str = None

EXPLANATIONS = {
    "urgency": "This message uses urgent language to pressure quick action - a common scam tactic.",
    "link": "This message contains a suspicious or shortened link.",
    "high_risk": "Our AI model flagged this message as high risk based on language patterns.",
    "safe": "No scam patterns detected.",
}

def check_url_heuristics(text: str) -> bool:
    shorteners = ["bit.ly", "tinyurl", "t.co", "cutt.ly", ".xyz"]
    return any(s in text.lower() for s in shorteners)

def check_urgency(text: str) -> bool:
    urgency_words = ["urgent", "immediately", "expire", "blocked", "act now", "verify now"]
    return any(w in text.lower() for w in urgency_words)

def get_scam_score(text: str) -> float:
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    return probs[0][1].item()

@app.post("/scan")
def scan_message(req: ScanRequest):
    text = req.text
    has_link_risk = check_url_heuristics(text)
    has_urgency = check_urgency(text)
    
    try:
        scam_score = get_scam_score(text)
    except Exception as e:
        print(f"Model inference failed: {e}")
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

    return {"score": round(final_score, 2), "action": action, "explanation": explanation}

@app.get("/")
def health_check():
    return {"status": "ScamShield backend is running"}