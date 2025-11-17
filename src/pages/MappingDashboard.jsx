import React from "react";
import TranslationCard from "../components/TranslationCard";

const Map = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">

        {/* --- HERO SECTION --- */}
        <div className="max-w-5xl w-full text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Namaste–ICD Unified Mapping Dashboard
          </h1>
          <p className="text-gray-600 mt-3 text-lg leading-relaxed">
            A modern platform for exploring, validating, and maintaining 
            cross-terminology mappings between{" "}
            <span className="font-semibold text-gray-900">
              Namaste Traditional Medicine
            </span>{" "}
            and the{" "}
            <span className="font-semibold text-gray-900">ICD-11 TM2</span> classification.
          </p>
        </div>

        {/* --- SEARCH TRANSLATION --- */}
        <div className="max-w-5xl w-full mb-10">
          <TranslationCard />
        </div>

        {/* --- 3-SECTION GRID --- */}
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6 mb-10">

          {/* ABOUT SECTION */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What Is Namaste–ICD Mapping?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This project bridges indigenous Namaste medical terminology with 
              the global ICD-11 TM2 disease classification.  
              Using semantic modeling (SapBERT), LLM-driven validation, and 
              curated rules, it creates a unified mapping layer that enables:
            </p>

            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>Interoperable medical datasets across traditional & modern systems</li>
              <li>Research-ready multilingual terminology alignment</li>
              <li>Improved encoding for EMR/EHR and medical NLP tasks</li>
              <li>Consistent classification of historically ambiguous terms</li>
            </ul>

            <p className="mt-3 text-gray-700 leading-relaxed">
              The platform currently hosts{" "}
              <span className="font-bold text-gray-900">~980 mappings data which includes exact code matches and term matches </span>{" "}
              from Namaste → ICD-11 TM2, processed through LLM validation, 
              semantic similarity scoring, and multi-stage filtering.
            </p>
          </div>

          {/* HOW IT WORKS SECTION */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How This Dashboard Works
            </h2>

            <ul className="text-gray-700 space-y-3 leading-relaxed">
              <li>
                🔍 <strong className="text-gray-900">Search Engine:</strong>  
                Query by code, Sanskrit term, diacritical, or ICD title using 
                optimized fuzzy search + diacritic normalization.
              </li>

              <li>
                🤖 <strong className="text-gray-900">LLM Auto-Validation:</strong>{" "}
                Gemini validates mapping correctness and flags low-confidence or 
                ambiguous pairs.
              </li>

              <li>
                🧬 <strong className="text-gray-900">SapBERT Training:</strong> {" "}
                Learns embeddings for Namaste ↔ ICD semantic similarity 
                with POS/NEG contrastive training.
              </li>

              <li>
                🗂️ <strong className="text-gray-900">Curated Final Dataset:</strong>  {" "}
                Combines model predictions + human-verified corrections to build 
                the final mapping set.
              </li>

              <li>
                📊 <strong className="text-gray-900">Explorer UI:</strong>  {" "}
                Browse, filter, approve, or reject mappings in real-time 
                directly from the dashboard.
              </li>
            </ul>
          </div>
        </div>

        {/* --- TRAINING GUIDELINES --- */}
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Training & Validation Guidelines
          </h2>

          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>
              <strong className="text-gray-900">Use at least 300–500 POS/NEG pairs</strong>{" "}
              before training SapBERT.  
              Smaller datasets produce unstable embeddings.
            </li>

            <li>
              <strong className="text-gray-900">Training format (required):</strong>
              <div className="ml-4 mt-2 p-4 bg-gray-50 border rounded-xl text-sm">
                <p><strong>text1:</strong> Namaste term + description</p>
                <p><strong>text2:</strong> ICD fullySpecifiedName + path + indexTerms</p>
                <p>
                  <strong>label:</strong> 
                  <span className="text-blue-600 font-bold"> 1</span> (correct) or 
                  <span className="text-red-600 font-bold"> 0</span> (incorrect)
                </p>
              </div>
            </li>

            <li>
              <strong className="text-gray-900">LLM validation uses the latest embedding file</strong>{" "}
              generated after each SapBERT run.
            </li>

            <li>
              This platform uses free-tier compute + free Gemini API.  
              Validation may take time and may not process the full dataset 
              in one batch.
            </li>
          </ul>
        </div>

        {/* --- DISCLAIMER --- */}
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl text-red-500 font-semibold mb-4">
            Medical Accuracy Disclaimer
          </h2>

          <p className="text-gray-700 leading-relaxed mb-3">
            The mappings, datasets, and validation results in this dashboard are 
            designed for research and demonstration. Some mappings are 
            model-generated and may not reflect verified clinical standards.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Always rely on qualified medical professionals for final interpretation.  
            This tool **does not replace clinical expertise**.
          </p>
        </div>

        <div className="text-gray-500 text-sm mt-10 mb-6">
          © {new Date().getFullYear()} Namaste–ICD Platform. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default Map;
