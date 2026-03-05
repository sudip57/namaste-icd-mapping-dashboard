import React from "react";
import {
  Code,
  Server,
  BookOpen,
  TerminalSquare,
  ArrowRight,
  Search,
  Globe,
  Database,
  Cpu,
  Layers,
} from "lucide-react";

export default function ApiDocs() {
  const baseUrl = "https://namaste-icd-microservice.vercel.app/";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-100">
              <Globe size={14} /> Developer Portal v2.0
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              API Documentation
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Access the Namaste-ICD microservice to retrieve traditional
              medicine mappings, WHO terminology datasets, and semantic
              embeddings for clinical NLP tasks.
            </p>
          </div>

          {/* BASE URL CARD */}
          <div className="w-full md:w-auto bg-slate-900 rounded-3xl p-6 shadow-2xl shadow-indigo-200/50 border border-slate-800">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Server size={14} /> Production Base URL
            </h2>
            <code className="text-emerald-400 font-mono text-sm bg-slate-800/50 px-4 py-2 rounded-xl block border border-slate-700">
              {baseUrl}
            </code>
          </div>
        </div>

        {/* API CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT SIDE: ENDPOINTS (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* SECTION: DATA RETRIEVAL */}
            <Section
              title="Data Retrieval"
              icon={<BookOpen className="text-indigo-600" />}
            >
              <ApiRoute
                method="GET"
                route="/data/get-embedding-data"
                desc="SapBERT semantic embedding mapping dataset."
                params={["page", "limit", "lowerbound", "upperbound"]}
              />
              <ApiRoute
                method="GET"
                route="/data/get-final-data"
                desc="Curated gold-standard Namaste → ICD mappings."
                params={["page", "limit"]}
              />
              <ApiRoute
                method="GET"
                route="/data/get-LLM-data"
                desc="Mappings processed through LLM auto-validation."
              />
            </Section>

            {/* SECTION: SEARCH & TRANSLATION */}
            <Section
              title="Search & Neural Search"
              icon={<Search className="text-blue-600" />}
            >
              <ApiRoute
                method="GET"
                route="/translate?code="
                desc="Bi-directional code translation (Namaste ↔ ICD-11)."
              />
              <ApiRoute
                method="GET"
                route="/lookup?q="
                desc="Fuzzy search across the curated final dataset."
              />
              <ApiRoute
                method="GET"
                route="/experimental/search?q="
                desc="Deep search using diacritic normalization + NLP."
              />
            </Section>

            {/* SECTION: INGESTION */}
            <Section
              title="Data Ingestion"
              icon={<TerminalSquare className="text-emerald-600" />}
            >
              <ApiRoute
                method="POST"
                route="/namaste/upload_ayurveda"
                desc="Upload Ayurveda CSV core dataset."
              />
              <ApiRoute
                method="POST"
                route="/namaste/upload_unani"
                desc="Upload Unani medical CSV dataset."
              />
            </Section>
          </div>

          {/* RIGHT SIDE: PAYLOADS & SCHEMAS (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-400">
                  <Layers size={80} />
                </div>
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2 tracking-tight">
                  <Code size={16} className="text-indigo-400" /> Request Payload
                </h3>
                <pre className="text-indigo-300 font-mono text-[11px] leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-slate-700 h-96 overflow-y-auto custom-scrollbar">
                  {`{
  "namaste": {
    "code": "SK50",
    "description": "...",
    "name_diacritical": "...",
    "discipline": "Ayurveda"
  },
  "icd": {
    "code": "TM2Y",
    "fullySpecifiedName": "...",
    "path": ["Traditional", "..."]
  },
  "similarity": 0.89,
  "label": 1
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 py-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Namaste–ICD Research Group
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ---- SUB-COMPONENTS ---- */

const Section = ({ title, icon, children }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
        {icon}
      </div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-widest text-sm">
        {title}
      </h2>
    </div>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </div>
);

const ApiRoute = ({ method, route, desc, params }) => (
  <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
              method === "GET"
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
            }`}
          >
            {method}
          </span>
          <code className="text-sm font-mono font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
            {route}
          </code>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
      <ArrowRight
        className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all hidden sm:block"
        size={20}
      />
    </div>

    {params && (
      <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
        <span className="text-[10px] font-black text-slate-400 uppercase mr-1 mt-1">
          Parameters:
        </span>
        {params.map((p) => (
          <span
            key={p}
            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono font-bold"
          >
            {p}
          </span>
        ))}
      </div>
    )}
  </div>
);
