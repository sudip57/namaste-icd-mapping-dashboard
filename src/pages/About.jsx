import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-20">

        {/* HERO */}
        <header className="space-y-4 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            About the NAMASTE–ICD Mapping Dashboard
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
            A modern platform that unifies traditional Indian medical terminology with
            WHO’s ICD-11 TM2 framework. Built for researchers, clinicians, and developers,
            it provides powerful tools to explore, validate, train, and standardize
            NAMASTE → ICD mappings with AI and embeddings.
          </p>
        </header>

        {/* WHAT IS NAMASTE */}
        <Section
          title="What is NAMASTE Terminology?"
          content={
            <>
              <p>
                <strong>NAMASTE (National AYUSH Morbidity and Standardised Terminologies Electronic)</strong> 
                is India’s official structured terminology system for Ayurveda, Siddha, Unani, Yoga,
                Sowa-Rigpa and Homeopathy.
              </p>

              <p className="mt-3">
                It defines thousands of clinical concepts with:
              </p>

              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Unique codes</li>
                <li>Sanskrit/Indic terms and diacritical forms</li>
                <li>Long & short definitions</li>
                <li>System/discipline classification</li>
              </ul>

              <p className="mt-4">
                This provides a consistent vocabulary for documenting AYUSH clinical data
                across institutions.
              </p>
            </>
          }
        />

        {/* TM2 */}
        <Section
          title="What is ICD-11 TM2?"
          content={
            <>
              <p>
                <strong>ICD-11 Traditional Medicine Chapter (TM2)</strong> is WHO’s international 
                classification system for symptoms, disorders, and diagnostic patterns used in 
                traditional medicine systems globally.
              </p>

              <p className="mt-4">
                It includes:
              </p>

              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Standardized fully specified names</li>
                <li>Hierarchical classification paths</li>
                <li>Synonyms & index terms</li>
                <li>Context-rich medical descriptions</li>
              </ul>

              <p className="mt-4">
                Mapping NAMASTE → ICD-11 TM2 bridges Indian traditional medicine with global
                healthcare data standards.
              </p>
            </>
          }
        />

        {/* WHY MAP */}
        <Section
          title="Why Create a NAMASTE → ICD Mapping?"
          content={
            <>
              <p>Mapping enables meaningful interoperability and research opportunities:</p>

              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Standardizes AYUSH clinical records across hospitals & EHR systems.</li>
                <li>Allows integration with global health datasets & reporting frameworks.</li>
                <li>Supports machine learning models trained on medical terminology.</li>
                <li>Enables comparative research between traditional and modern diagnostics.</li>
                <li>Provides a unified digital vocabulary for Indian traditional medicine.</li>
              </ul>
            </>
          }
        />

        {/* WHAT THIS DASHBOARD PROVIDES */}
        <Section
          title="What This Dashboard Offers"
          content={
            <>
              <p>
                This dashboard is the first unified tooling system designed specifically for
                NAMASTE ↔ ICD workflows. It includes:
              </p>

              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>
                  <strong>Search engine</strong>
                </li>
                <li>
                  <strong>LLM-based auto validation</strong> using Gemini 2.5 Flash for semantic reasoning.
                </li>
                <li>
                  <strong>SapBERT-powered embedding training</strong> to improve mapping accuracy.
                </li>
                <li>
                  <strong>Interactive mapping review pipeline</strong> (approve/reject mappings).
                </li>
                <li>
                  <strong>Full dataset explorer</strong> with pagination, similarity filters & detailed ICD context.
                </li>
                <li>
                  WHO Ayurvedic terminology exploration through AYU-TERM search.
                </li>
              </ul>

              <p className="mt-4">
                The platform is optimized for researchers, terminology experts, annotation teams,
                and AI/ML practitioners working on medical knowledge alignment.
              </p>
            </>
          }
        />


        {/* DISCLAIMER */}
        <Section
          title="Disclaimer"
          content={
            <p>
              This project is built for research and terminology integration purposes.  
              Mapping results may contain inaccuracies due to model limitations or ambiguous terms.
              All clinical usage requires review by qualified medical professionals.  
              This tool does not replace clinical judgment or WHO-certified mapping guidelines.
            </p>
          }
        />

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm pt-16 pb-6">
          © {new Date().getFullYear()} NAMASTE–ICD Mapping Dashboard
        </div>

        {/* Animations */}
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
          `}
        </style>
      </div>
    </div>
  );
}

/* Section Component */
function Section({ title, content }) {
  return (
    <section className="bg-white shadow-sm rounded-2xl p-8 border animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 pl-3 border-blue-600">
        {title}
      </h2>

      <div className="text-gray-700 leading-relaxed text-[15px]">
        {content}
      </div>
    </section>
  );
}
