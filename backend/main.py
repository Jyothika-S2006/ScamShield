import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="ScamShield API")

# Hugging Face Inference Endpoint
HF_API_URL = "https://api-inference.huggingface.co/models/JyothikaShanmugam/scamshield-muril"

class TextRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"status": "ScamShield API is running"}

@app.post("/predict")
def predict(payload: TextRequest):
    response = requests.post(
        HF_API_URL,
        json={"inputs": payload.text},
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, 
            detail=response.json()
        )
        
    return response.json()