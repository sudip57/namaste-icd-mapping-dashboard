🌐 NAMASTE–ICD Mapping Dashboard (Frontend)

A modern React-based dashboard for exploring, validating, and managing terminology mappings between:

NAMASTE AYUSH Codes

WHO Standardised Terminologies for Ayurveda

ICD-11 TM2 (Traditional Medicine)

ICD-11 Biomedicine (subset)

This UI is built to support researchers, practitioners, and developers working on NLP-based terminology alignment, SapBERT training, and LLM-assisted mapping validation.

🚀 Features
🔍 Smart Search

Search NAMASTE terms by code, transliteration, diacritical, cleaned terms

Search ICD-11 TM2 by code, index terms, fully specified names

Instant fuzzy-match & near-match support

📊 Mapping Review Interface

Displays:

NAMASTE entry

ICD-11 candidate matches

SapBERT similarity score

Gemini LLM similarity reasoning

Reviewer options:

✔ Approve

✘ Reject

Mobile-optimized table layout with responsive action buttons.

🧠 AI-Powered Evaluation (Integrated Backend Support)

Supports backend workflows for:

Gemini-based auto-validation

SapBERT similarity / embedding review

Dual mapping inspection (Namaste ↔ TM2)

The frontend renders AI-generated scores and insights clearly for human decision-making.

📁 Dataset Browsing

View large mapping datasets with pagination

Filter by similarity range

Toggle between:

LLM Mapping Dataset

SapBERT Embedding Dataset

Final Mapping Dataset

📘 Documentation & API Status Pages

Built-in UI sections for:
✔ About NAMASTE Terminology
✔ About ICD-11 TM2
✔ Mapping methodology
✔ API documentation
✔ Usage instructions

🛠️ Local Setup
1️⃣ Clone

git clone https://github.com/sudip57/namaste-icd-mapping-dashboard.git

cd namaste-icd-mapping-dashboard

2️⃣ Install

npm install

3️⃣ Start Dev Server

npm run dev

🛡️ Disclaimer

This dashboard is not a medical decision system.
Mappings are generated using AI/ML models and must be reviewed by qualified medical professionals before clinical use.

📜 License

MIT License — Free for personal and commercial use.
