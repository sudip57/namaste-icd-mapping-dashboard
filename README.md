# 🌐 Namaste-ICD Dashboard
Frontend interface for exploring, testing, and reviewing terminology mappings between:

- **NAMASTE AYUSH Codes**
- **WHO Ayurveda Terminologies**
- **ICD-11 TM2 (Traditional Medicine)**
- **ICD-11 Biomedical Subset**

This dashboard provides a user-friendly interface built with **React & Tailwind**, designed to support mapping analysis, dataset review, and AI-assisted validation workflows.

---

## 🚀 Key Features

### 🔍 Terminology Search
- Search using code, Sanskrit, diacritical form, or transliteration
- Supports fuzzy matching and nearest-term suggestions
- Instant lookup through backend search API

---

### 📊 Mapping Review Panel
Displays mapping candidate with:
| Data Shown | Description |
|------------|-------------|
| NAMASTE term | Original medical terminology |
| ICD-11 candidate | Suggested equivalent |
| Similarity score | SapBERT-based |
| AI reasoning | Extracted from backend LLM validation |

Reviewer can:

✔ Approve mapping  
✖ Reject mapping  

---

### 🧠 AI Insights (Read-Only Display)
- Shows AI-generated reasoning and similarity info returned by backend  
- *Used only to assist manual approval*  
- **No AI logic runs directly in the frontend**

> 🚨 AI training & auto-validation features are **backend-only**.  
> They rely on limited free-tier compute and may become unavailable during resource exhaustion.

---

### 📁 Dataset Browser
- Pagination for large terminology mappings  
- Filter by similarity score range  
- Switch views between:
  - Final Approved Dataset  
  - LLM Candidate Dataset  
  - Embedding-Based Matches  

---

## 🛠 Tech Stack
| Layer | Technology |
|-------|------------|
| UI | React + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State | React Hooks |
| API Layer | REST over Axios |

---

## 📦 Local Setup

```bash
git clone https://github.com/sudip57/namaste-icd-mapping-dashboard.git
cd namaste-icd-mapping-dashboard
npm install
npm run dev
```
📌 Backend Integration

This dashboard interacts with the backend microservice documented here:
👉 Backend Repo: https://github.com/sudip57/namaste-icd-mapping-microservice.git
The frontend only reads mapping & validation data. AI training or retraining is handled manually from backend.

⚠ Disclaimer

This system is intended for research and analysis only.
All mappings are AI-generated and must be reviewed and approved by qualified professionals before any clinical use.

📜 License

MIT License — Open-source and free to use.

📬 Contact
Email: sudiptarafdar756@gmail.com
Sudip Tarafdar – Creator & Maintainer
For collaboration or feedback, reach out via GitHub issues or direct contact.
