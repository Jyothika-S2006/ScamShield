from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(
    title="ScamShield API",
    description="Text classification for scam detection using scamshield-muril"
)

# Load the model directly using transformers
classifier = pipeline(
    "text-classification",
    model="JyothikaShanmugam/scamshield-muril"
)

# Define proper request schema to avoid 400/422 errors
class AnalysisRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "ScamShield API is running"}

@app.post("/predict")
def predict(payload: AnalysisRequest):
    result = classifier(payload.text)
    return {"prediction": result}