import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Direct Hugging Face Serverless API Endpoint
HF_API_URL = "https://router.huggingface.co/hf-inference/models/JyothikaShanmugam/scamshield-muril"


class TextRequest(BaseModel):
    text: str


@app.get("/version")
def version():
    return {"status": "v2-direct-rest-active"}


@app.post("/predict")
def predict(payload: TextRequest):
    hf_token = os.getenv("HF_TOKEN")

    if not hf_token:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN environment variable is missing on Render.",
        )

    headers = {
        "Authorization": f"Bearer {hf_token.strip()}",
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
            detail=f"Failed to connect to Hugging Face: {str(err)}",
        )

    # Handle standard non-200 responses safely
    if response.status_code != 200:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text
        raise HTTPException(status_code=response.status_code, detail=error_data)

    return response.json()