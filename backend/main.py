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
    hf_token = os.getenv("HF_TOKEN")

    if not hf_token:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN environment variable is missing on Render.",
        )

    try:
        # Initialize client with explicit model and token
        client = InferenceClient(model=MODEL_ID, token=hf_token.strip())
        results = client.text_classification(payload.text)
        return results
    except Exception as err:
        # Captures exact exception type and full error string
        detail_msg = f"{type(err).__name__}: {str(err) or repr(err)}"
        raise HTTPException(status_code=500, detail=detail_msg)