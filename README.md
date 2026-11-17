# PhytoTurboNet — Crop Leaf Disease Detection Research Platform

> **Comparative Analysis of Deep Learning Architectures for Automated Crop Leaf Disease Detection**
> Models: Custom CNN · ResNet · EfficientNet (TFLite)

---

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Frontend Setup](#frontend-setup)
6. [Backend Setup](#backend-setup)
7. [Integrating Trained Models](#integrating-trained-models)
8. [API Endpoint Reference](#api-endpoint-reference)
9. [Evaluation Results](#evaluation-results)
10. [Contributing](#contributing)

---

## Overview

PhytoTurboNet is a research web platform for benchmarking three deep learning architectures on a crop leaf disease classification task. It provides:

- **Interactive inference UI** — upload a leaf image and get predictions from all three models side-by-side.
- **Comparative dashboard** — accuracy, F1, confusion matrices, and per-class metrics visualised with Recharts.
- **REST API** — FastAPI backend serving each model independently, with structured JSON responses.

This repository contains **scaffold only**. Model weights (`*.pth`, `*.tflite`) and training code are managed separately and are **not committed to version control**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Routing | React Router v6 |
| Charts | Recharts 2 |
| Animation | Framer Motion |
| HTTP client | Axios |
| Backend | FastAPI 0.115 + Uvicorn |
| DL inference | PyTorch 2.4 (CNN/ResNet) · TFLite Runtime 2.14 (EfficientNet) |
| Image processing | Pillow · OpenCV (headless) |
| Validation | Pydantic v2 |

---

## Project Structure

```
project/
├── frontend/
│   ├── public/
│   │   └── leaf-icon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer, etc.
│   │   │   └── ui/            # Reusable UI primitives (Button, Card, …)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route-level page components
│   │   ├── sections/          # Large page sections (Hero, Results, …)
│   │   ├── services/          # Axios API service layer
│   │   ├── App.jsx            # Router + layout shell
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Tailwind directives + global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/            # FastAPI routers (predict, results, health)
│   │   ├── models/
│   │   │   ├── custom_cnn/    # model.pth + architecture.py
│   │   │   ├── resnet/        # model.pth + architecture.py
│   │   │   └── efficientnet/  # model.tflite
│   │   ├── services/          # Inference service classes
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── utils/             # Image preprocessing, helpers
│   │   └── data/
│   │       ├── class_mapping.json
│   │       └── preprocessing_config.json
│   ├── evaluation_results/
│   │   ├── custom_cnn/        # metrics.json, confusion_matrix.json, .png
│   │   ├── resnet/
│   │   └── efficientnet/
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18.x and **pnpm** (or npm/yarn)
- **Python** ≥ 3.10
- A virtual environment tool (`venv`, `conda`, etc.)
- CUDA toolkit (optional, for GPU inference with PyTorch)

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install          # or: npm install

# Start dev server (proxies /api → localhost:8000)
pnpm dev              # → http://localhost:5173

# Production build
pnpm build
pnpm preview
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:8000`, so the backend must be running for API calls to work.

---

## Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env     # Windows
# cp .env.example .env     # macOS/Linux
# Edit .env — set model paths and other config as needed

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `/docs` (Swagger) and `/redoc`.

---

## Integrating Trained Models

### 1. Custom CNN

See [`backend/app/models/custom_cnn/README.md`](backend/app/models/custom_cnn/README.md).

**Summary:**
- Place `model.pth` (with `model_state_dict` key) in `backend/app/models/custom_cnn/`.
- Create `architecture.py` defining the `CustomCNN` class.
- Populate `class_mapping.json` and `preprocessing_config.json → custom_cnn`.

### 2. ResNet

See [`backend/app/models/resnet/README.md`](backend/app/models/resnet/README.md).

**Summary:**
- Confirm the exact variant (ResNet-18/50/101/…) **before** writing `architecture.py`.
- Place `model.pth`, create `architecture.py`.
- Populate preprocessing config for `resnet`.

### 3. EfficientNet (TFLite)

See [`backend/app/models/efficientnet/README.md`](backend/app/models/efficientnet/README.md).

**Summary:**
- Confirm variant and whether quantized (INT8/FP16/None).
- Place `model.tflite`.
- Populate `preprocessing_config.json → efficientnet` with correct `dtype`, `input_size`, `mean`, `std`.

---

## API Endpoint Reference

> **Base URL:** `http://localhost:8000/api`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns server and model load status |
| `POST` | `/predict/custom_cnn` | Run inference with Custom CNN |
| `POST` | `/predict/resnet` | Run inference with ResNet |
| `POST` | `/predict/efficientnet` | Run inference with EfficientNet |
| `POST` | `/predict/all` | Run all three models in parallel, return combined result |
| `GET` | `/results/{model_id}` | Retrieve evaluation metrics for a model |
| `GET` | `/results/{model_id}/confusion_matrix` | Retrieve confusion matrix data |

### Request — `/predict/*`
```
Content-Type: multipart/form-data
Body: file (image/jpeg or image/png, max 10 MB)
```

### Response — `/predict/*`
```json
{
  "model_id": "custom_cnn",
  "predicted_class": "Tomato___Early_blight",
  "predicted_index": 7,
  "confidence": 0.934,
  "top5": [
    { "class": "Tomato___Early_blight", "confidence": 0.934 },
    { "class": "Tomato___Septoria_leaf_spot", "confidence": 0.041 }
  ],
  "inference_time_ms": 42.1
}
```

---

## Evaluation Results

Evaluation results live in `backend/evaluation_results/<model_id>/`:

| File | Contents |
|------|----------|
| `metrics.json` | Overall accuracy, F1, precision, recall, MCC, Cohen's κ |
| `confusion_matrix.json` | Full confusion matrix data (class labels + matrix) |
| `confusion_matrix.png` | Visual confusion matrix heatmap |

> **Important:** Populate these files only with **held-out test set** results. Never use training or validation metrics.

The frontend dashboard reads these files via `GET /api/results/{model_id}` and renders comparative charts automatically once populated.

---

## Contributing

1. Fork and create a feature branch.
2. Follow existing code style (ESLint for JS, Black + isort for Python).
3. Do not commit model weights (`*.pth`, `*.tflite`) — add them to `.gitignore` entries.
4. Open a pull request with a clear description of changes.

---

*PhytoTurboNet — built for research reproducibility and transparent model comparison.*
