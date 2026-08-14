from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os

app = FastAPI(
    title="ScamShield Backend",
    version="1.0.0"
)

# <--- 2. Paste Mohan's CORS snippet here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_API_URL = "https://router.huggingface.co/hf-inference/models/JyothikaShanmugam/scamshield-muril"
HF_TOKEN = os.getenv("HF_TOKEN")


class ScanRequest(BaseModel):
    user_id: str = "anonymous"
    text: str


def analyze_text_with_hf(text: str):
    try:
        headers = {}

        if HF_TOKEN:
            headers["Authorization"] = f"Bearer {HF_TOKEN}"

        response = requests.post(
            HF_API_URL,
            headers=headers,
            json={"inputs": text},
            timeout=30
        )

        print("HF STATUS:", response.status_code)
        print("HF RESPONSE:", response.text)

        if response.status_code != 200:
            return 0.5, "UNKNOWN"

        result = response.json()

        if isinstance(result, list) and len(result) > 0:
            predictions = result[0]

            if isinstance(predictions, list):
                top_pred = max(
                    predictions,
                    key=lambda x: x.get("score", 0)
                )
            else:
                top_pred = predictions

            return (
                top_pred.get("score", 0.5),
                top_pred.get("label", "UNKNOWN")
            )

    except Exception as e:
        print("Hugging Face API Error:", e)

    return 0.5, "UNKNOWN"


@app.get("/")
def home():
    return {
        "message": "ScamShield Backend Engine Running"
    }


@app.post("/scan")
def scan_message(payload: ScanRequest):

    text = payload.text.lower()

    has_link = any(
        pattern in text
        for pattern in [
            "http",
            "bit.ly",
            "t.co",
            ".com",
            ".in"
        ]
    )

    has_urgency = any(
        word in text
        for word in [
            "urgent",
            "verify",
            "blocked",
            "account",
            "suspend",
            "upi",
            "pin",
            "winner"
        ]
    )

    model_score, model_label = analyze_text_with_hf(
        payload.text
    )

    is_scam = (
        has_link
        or has_urgency
        or model_score > 0.7
        or "1" in str(model_label)
    )

    if is_scam:

        action = (
            "Block & Alert"
            if has_link and has_urgency
            else "Verify Carefully"
        )

        explanation = (
            f"Flagged by MuRIL AI model "
            f"({model_label}) or heuristic rule detection."
        )

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