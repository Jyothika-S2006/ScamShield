# ScamShield for Families

**Real-time fraud detection app for Indian families using UPI — built for NexBuildOn Hack 2026 (Round 1 & 2)**

Team **Odyssey** | Sambhram Institute of Technology
Problem Statement 11 — Cybersecurity & Digital Privacy

---

## The Problem

India logged **1,01,928 cybercrime cases in 2024** (NCRB), with **72.6% driven by financial fraud** — UPI scams, phishing links, and "digital arrest" impersonation calls. Families using UPI, seniors, and first-time digital users are the most targeted and the least protected: existing tools (caller ID apps, bank SMS alerts) are reactive, English-heavy, and fragmented.

**ScamShield** checks SMS, UPI requests, call transcripts, and links in real time, and tells the user in plain language whether to **Block, Verify, or continue Safely.**

---

## What We Built

- **Fine-tuned AI model** — MuRIL (`google/muril-base-cased`), fine-tuned on an 816-row custom labeled dataset of scam/safe messages (SMS, UPI, phishing links), trained on Kaggle's free GPU notebooks. Hosted publicly on Hugging Face: [`JyothikaShanmugam/scamshield-muril`](https://huggingface.co/JyothikaShanmugam/scamshield-muril).
- **FastAPI backend** — combines the fine-tuned model's prediction with rule-based heuristics (urgency language detection, suspicious/shortened link detection) to produce a final risk score and plain-language explanation.
- **React Native / Bolt frontend** — mobile-first UI supporting four input types (SMS, UPI Request, Voice/Call transcript, Website Link), with quick demo samples, a risk score display, and an action checklist.
- **Resilient design** — the frontend gracefully falls back to on-device heuristic analysis if the cloud model endpoint is temporarily unreachable, so the app never fails to give the user an answer.

---

## Repository Structure

```
ScamShield/
├── backend/          FastAPI service — model inference + heuristic scoring
├── frontend/          React Native / Bolt app — user-facing UI
├── model-training/    MuRIL fine-tuning script + labeled dataset (Kaggle)
├── .expo/             Expo configuration for local frontend testing
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) / Bolt |
| Backend | FastAPI (Python) |
| AI/ML | MuRIL — fine-tuned transformer for Indian-language scam classification |
| Model hosting | Hugging Face Hub |
| Training | Kaggle Notebooks (free GPU) |
| Local deployment | Uvicorn + ngrok (public tunnel) |

---

## How It Works

1. User pastes a message, UPI request, call transcript, or link into the app.
2. The backend runs it through the fine-tuned MuRIL model to get a scam probability score.
3. Rule-based heuristics check for urgency language (e.g. "act now," "account blocked") and suspicious/shortened links, adjusting the score.
4. The combined score maps to an action: **Block** (high risk), **Verify** (moderate risk), or **Safe**.
5. The user receives a plain-language explanation and an immediate action checklist (e.g. "never share your UPI PIN," "report to Cyber Crime Helpline 1930").

---

## Running the Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Test at `http://localhost:8000/docs`.

To expose it publicly (used for live testing during development):
```bash
ngrok http 8000
```

---

## Running the Frontend Locally

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (same network as your laptop).

---

## Model Training

The MuRIL fine-tuning script is in `model-training/train_muril.py`. It was trained on Kaggle using a free GPU notebook on an 816-row labeled dataset (`final_dataset.csv`, ~51% safe / 49% scam, combining two independently collected datasets after deduplication).

```bash
# Run inside a Kaggle notebook with GPU enabled
python train_muril.py
```

The trained model is uploaded to Hugging Face and loaded directly into the FastAPI backend via the `transformers` library.

---

## Known Limitations & Honest Notes

- Hugging Face's free serverless Inference API does not reliably serve custom fine-tuned models at scale, so the backend loads the model directly using the `transformers` library instead of calling that API.
- Free-tier cloud hosting (Render) could not reliably run the model due to RAM limits on ~950MB model weights; the working demo runs the backend locally via `uvicorn` + `ngrok` for a live public tunnel.
- The frontend includes a local heuristic fallback so the app remains functional even if the cloud model endpoint is briefly unreachable — a deliberate reliability design choice, not a bug.
- **Roadmap:** production deployment would use containerized model weights (Docker) on a dedicated GPU instance to eliminate cold-start/network dependency entirely.

---

## Team

- **Jyothika S** — Team Lead, model training & data pipeline
- **Inchara I** — Backend (FastAPI, deployment)
- **Mohan M** — Frontend (React Native / Bolt)
- **Sanika K** — Dataset creation & QA testing

---

## Future Scope

- Audio-based voice-clone detection (beyond text transcripts)
- Bank / NBFC / telecom partnership pilots
- Direct integration with India's I4C Chakshu reporting portal
- Family safety circle push alerts for pending high-risk transactions

---

*Built for NexBuildOn Hack 2026 — Innovating for Real-World Impact.*

