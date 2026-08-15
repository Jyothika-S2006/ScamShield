import os
from fastapi import FastAPI, HTTPException
from huggingface_hub import InferenceClient
from pydantic import BaseModel

app = FastAPI()

MODEL_ID = "JyothikaShanmugam/scamshield-muril"


class TextRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "ScamShield API is online!"}


@app.post("/predict")
def predict(payload: TextRequest):
    # Fetch token dynamically per request
    hf_token = os.getenv("HF_TOKEN")

    if not hf_token:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN is missing. Please add HF_TOKEN under Render Environment variables.",
        )

    try:
        client = InferenceClient(api_key=hf_token.strip())
        results = client.text_classification(payload.text, model=MODEL_ID)
        return results
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=f"Hugging Face Error: {str(err)}"
        )