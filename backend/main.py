import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Updated Hugging Face Serverless Inference URL
HF_API_URL = "https://router.huggingface.co/hf-inference/models/JyothikaShanmugam/scamshield-muril"
HF_TOKEN = os.environ.get("HF_TOKEN")


class TextRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "ScamShield API is online!"}


@app.post("/predict")
def predict(payload: TextRequest):
    if not HF_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN environment variable is missing on Render",
        )

    headers = {
        "Authorization": f"Bearer {HF_TOKEN.strip()}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            HF_API_URL,
            headers=headers,
            json={"inputs": payload.text},
            timeout=30,
        )
    except requests.exceptions.RequestException as err:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to reach Hugging Face API: {str(err)}",
        )

    try:
        data = response.json()
    except Exception:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Raw HF Response: {response.text}",
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=data)

    return data