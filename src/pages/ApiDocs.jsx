import React from "react";
import { Code, Server, BookOpen, TerminalSquare, ArrowRight } from "lucide-react";

export default function ApiDocs() {
  const baseUrl = "https://namaste-icd-microservice.vercel.app/";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="max-w-5xl w-full">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Namaste–ICD API Documentation
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            A simple, fast, and structured API for accessing Namaste Traditional Medicine
            data, ICD-11 TM2 mappings, embeddings, validation datasets, and utilities.
          </p>
        </div>

        {/* BASE URL */}
        <div className="bg-white rounded-2xl shadow p-6 border mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <Server className="text-blue-600" /> Base URL
          </h2>
          <code className="block bg-gray-900 text-green-400 px-4 py-2 rounded-lg mt-2 text-sm overflow-x-auto">
            {baseUrl}
          </code>
        </div>

        {/* SECTION: DATA FETCHING */}
        <Section title="Data Retrieval Endpoints" icon={<BookOpen className="text-purple-600" />}>
          <ApiRoute method="GET" route="/data/get-embedding-data" desc="Returns SapBERT embedding-based mapping dataset." params="page, limit, lowerbound, upperbound" />

          <ApiRoute method="GET" route="/data/get-final-data" desc="Fetches final curated Namaste → ICD mapping dataset." params="page, limit, lowerbound, upperbound" />

          <ApiRoute method="GET" route="/data/get-LLM-data" desc="Fetches LLM-validated mapping dataset." params="page, limit" />

          <ApiRoute method="GET" route="/data/get-ayu-terms-data" desc="WHO International Ayurvedic Terminology full dataset." params="page, limit, lowerbound, upperbound" />
        </Section>

        {/* SECTION: UPLOAD */}
        <Section title="Upload Endpoints" icon={<TerminalSquare className="text-emerald-600" />}>
          <ApiRoute method="POST" route="/namaste/upload_ayurveda" desc="Upload new Ayurveda CSV dataset." />

          <ApiRoute method="POST" route="/namaste/upload_siddha" desc="Upload Siddha terminology CSV dataset." />

          <ApiRoute method="POST" route="/namaste/upload_unani" desc="Upload Unani medical CSV dataset." />
        </Section>

        {/* SECTION: FINAL MAP UPDATE */}
        <Section title="Final Mapping Update" icon={<Code className="text-yellow-600" />}>
          <ApiRoute
            method="POST"
            route="/approve/final_map"
            desc="Append/update an item in the final mapping dataset."
          />

          <div className="bg-gray-900 mt-4 text-gray-200 rounded-xl p-4 text-sm overflow-x-auto">
            <pre>
{`{
  "namaste": {
    "code": "",
    "description": "",
    "discipline": "",
    "name_diacritical": "",
    "name_term_indic": ""
  },
  "icd": {
    "code": "",
    "fullySpecifiedName": "",
    "description": "",
    "path": [],
    "indexTerms": []
  },
  "similarity": 0.89,
  "label": "valid"
}`}
            </pre>
          </div>
        </Section>

        {/* SECTION: SEARCH ENDPOINTS */}
        <Section title="Search Endpoints" icon={<SearchIcon />}>
          <ApiRoute method="GET" route="/detailsOfAyuTerms?q=" desc="Search Ayurvedic WHO terminologies." />
          <ApiRoute method="GET" route="/translate?code=" desc="Translate Namaste code → ICD code and reverse." />
          <ApiRoute method="GET" route="/lookup?q=" desc="Search final mapping dataset (curated)." />
          <ApiRoute method="GET" route="/experimental/search?q=" desc="Search LLM-validated mappings (diacritic + fuzzy)." />
        </Section>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm mt-16">
          © {new Date().getFullYear()} Namaste–ICD Platform API • All rights reserved
        </div>
      </div>
    </div>
  );
}

/* ---- COMPONENTS ---- */

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow p-8 border mb-10">
    <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
      {icon} {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const ApiRoute = ({ method, route, desc, params }) => (
  <div className="bg-gray-50 border rounded-xl p-4 shadow-sm hover:shadow transition">
    <div className="flex items-center justify-between">
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
        }`}
      >
        {method}
      </span>
      <ArrowRight className="text-gray-400" />
    </div>

    <code className="block text-sm mt-2 text-gray-800 font-mono">{route}</code>

    <p className="text-gray-600 mt-2 text-sm">{desc}</p>

    {params && (
      <p className="text-gray-700 text-xs mt-2">
        <strong>Params:</strong> {params}
      </p>
    )}
  </div>
);

const SearchIcon = () => (
  <svg
    className="w-6 h-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
