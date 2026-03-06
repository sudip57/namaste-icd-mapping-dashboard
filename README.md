# 🧠 Namaste-ICD: AYUSH to ICD-11 Mapping Microservice

**Namaste-ICD** is a specialized AI-driven terminology mapping platform designed to bridge the gap between traditional medicine (Ayurveda, Siddha, Unani) and global healthcare standards (**ICD-11 TM2**).

---

## 🏗 System Architecture

The project utilizes a distributed microservice architecture to handle heavy AI inference and GPU-intensive training jobs.


<img width="1408" height="768" alt="architecture" src="https://github.com/user-attachments/assets/f189c7d8-eee1-4b27-b683-c7e60e3e297d" />

### 1. Core Components
* **Frontend (React/Tailwind):** A professional validation dashboard for medical experts to review, approve, or reject AI-proposed mappings.
* **Node.js Backend:** The central orchestrator managing search logic, mapping storage, and synchronization with ICD-11.
* **Python AI Microservice (Railway):** Handles SapBERT inference and Gemini-driven clinical validation.
* **Lightning AI (GPU):** A dedicated pipeline for fine-tuning SapBERT models on specific AYUSH-ICD pairs.
* **Dropbox Storage:** Acts as the persistent layer for model embeddings and training datasets.

---

## 🔍 Mapping Workflow

The system follows a 5-stage pipeline to ensure clinical validity:

| Stage | Process | Logic |
| :--- | :--- | :--- |
| **1** | **Rule-Based Lookup** | Direct matches and synonym mapping |
| **2** | **SapBERT Ranking** | Semantic similarity scores generated via vector embeddings |
| **3** | **AI Validation** | Gemini LLM analyzes clinical definitions to verify context |
| **4** | **Human Approval** | Experts verify the Top 3 proposed matches via UI |
| **5** | **Publication** | Finalized mappings synced to production database |

---

## 🚀 Key Features

* **Dual-Model Validation:** Cross-references SapBERT's technical similarity with Gemini's clinical reasoning.
* **Interactive Validation UI:** `ItemCard` components with real-time feedback and score visualizations.
* **Automated Training Pipeline:** Trigger GPU training jobs via REST endpoints to improve accuracy.
* **Live Logging:** Stream training logs directly to the frontend via Server-Sent Events (SSE).

---

## 🔌 API Reference (AI Microservice)

### Training Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/run-training-job` | Triggers a Lightning AI GPU job to retrain SapBERT |
| `GET` | `/training-status` | Returns the current progress of the training job |
| `GET` | `/training-stream` | Streams live logs from the training environment |

### Validation Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/run-auto-validation` | Runs Gemini AI against a set of proposed mappings |
| `POST` | `/tempMap/accept` | Approves a mapping (moves to human-verified state) |

---

## 🛠 Tech Stack

* **Frontend:** React.js, Lucide Icons, Tailwind CSS, Axios
* **Backend:** Node.js, Express
* **AI/ML:** Python, PyTorch, SapBERT, Google Gemini API, Lightning AI
* **DevOps:** Dropbox API, Railway, Vercel

---

## ⚖️ Usage Warning
The Python AI microservice consumes significant cloud resources. **Avoid repeated training requests.** This service is optimized for R&D; monitor quota limits during GPU jobs.
