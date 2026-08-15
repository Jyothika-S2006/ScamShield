import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

HF_API_URL = (
    "https://api-inference.huggingface.co/models/JyothikaShanmugam/scamshield-muril"
)
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
            status_code=500, detail="HF_TOKEN environment variable is missing"
        )

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(
        HF_API_URL, headers=headers, json={"inputs": payload.text}
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=response.json()
        )

    return response.json()