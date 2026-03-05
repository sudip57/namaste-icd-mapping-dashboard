import React, { useState } from "react";
import axios from "axios";
import {
  ArrowLeftRight,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Info,
  Hash,
  Database,
  ArrowRight
} from "lucide-react";

const BASE = "https://namaste-icd-microservice.vercel.app";

export default function TranslationCard() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const translate = async () => {
    setError("");
    setTranslations(null);

    if (!input.trim()) {
      setError("Please enter a code to translate.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${BASE}/translate`, {
        params: { code: input.trim() },
      });
      const data = res.data;
      if (data.full_translation) {
        setTranslations([data.full_translation]);
      } else if (data.results && data.results.length > 0) {
        setTranslations(data.results.map((item) => item.full_translation));
      } else {
        setError("No exact match found in the unified dataset.");
      }
    } catch (err) {
      console.error(err);
      setError("System could not find a validated mapping for this code.");
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      translate();
    }
  };
  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <ArrowLeftRight size={22} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Unified Code Translator
        </h2>
      </div>

      {/* INFO SECTION */}
      <div className="flex items-start gap-3 mb-8 bg-slate-50 border border-slate-100 rounded-2xl p-4">
        <Info size={18} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Cross-reference <span className="text-slate-900 font-bold">Namaste Traditional codes</span> with <span className="text-indigo-600 font-bold">ICD-11-TM2</span>. 
          Enter SK, TM2, or legacy ICD-10 codes (e.g., "SK50") for a validated mapping.
        </p>
      </div>

      {/* INPUT GROUP */}
      <div className="relative group mb-2">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Hash size={18} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Namaste or ICD code…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value === "") {
                setTranslations(null);
                setError("");
              }
            }}
            onKeyDown={handleKeyPress}
            className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
          />
          <button
            onClick={translate}
            className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-[11px] font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
          <XCircle size={14} /> {error}
        </div>
      )}

      {/* RESULTS LIST */}
      {translations && (
        <div className="mt-8 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {translations.map((t, index) => (
            <div
              key={index}
              className="group border border-slate-100 rounded-[1.5rem] bg-white p-5 hover:border-indigo-200 hover:shadow-lg transition-all relative overflow-hidden"
            >
              {/* Result Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Mapping #{index + 1}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <BadgeCheck className="text-emerald-600" size={14} />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Verified</span>
                </div>
              </div>

              {/* Translation Grid */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Namaste Source */}
                <div className="flex-1 w-full">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Source Term</div>
                  <div className="text-base font-black text-slate-900 leading-tight">
                    <span className="text-indigo-600 mr-2">{t.namaste_code}</span>
                    {t.namaste_name_diacritical}
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-full text-slate-300 hidden md:block">
                  <ArrowRight size={16} />
                </div>

                {/* ICD Target */}
                <div className="flex-1 w-full">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Match</div>
                  <div className="text-base font-black text-slate-900 leading-tight">
                    <span className="text-emerald-600 mr-2">{t.icd_code}</span>
                    {t.icd_name}
                  </div>
                </div>
              </div>

              {/* Collapsible Details */}
              <div className="mt-4 pt-4 border-t border-slate-50">
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {expanded[index] ? "HIDE CLINICAL DATA" : "SHOW CLINICAL DATA"}
                  {expanded[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expanded[index] && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[12px] text-slate-600 leading-relaxed animate-in slide-in-from-top-2">
                    <div className="flex gap-2 mb-2">
                      <Database size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-slate-900">Description:</strong>{" "}
                        {t.description||t.short_definition||t.long_definition || "No specific index description available for this mapping."}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                      Registry Source: Standardized TM2 Core Set
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}