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
      setError("Please enter a code.");
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
        setError("No match found.");
      }
    } catch (err) {
      console.error(err);
      setError("No match found.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      translate();
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border p-8 mb-14">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRight size={24} className="text-blue-600" />
          Namaste–ICD code translator
        </h2>
      </div>

      {/* INFO SECTION */}
      <div className="flex items-start gap-3 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Info size={18} className="text-blue-700 mt-1" />
        <p className="text-sm text-blue-800 leading-relaxed">
          This tool allows you to convert **Namaste Traditional Medicine codes**
          into their corresponding **ICD-11-TM2 disease classifications**, and
          vice-versa. Enter any supported code (e.g. "SK50", “TM2 codes”, or
          ICD-10 code like "A00"), and the system will return all validated
          mappings along with descriptions. Currently it supports only
          Namaste-ICD11TM2 codes not biomedicines.
        </p>
      </div>

      {/* INPUT */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter Namaste or ICD code…"
          value={input}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);

            if (value.trim() === "") {
              setTranslations(null);
              setError("");
            }
          }}
          onKeyDown={handleKeyPress}
          className="w-full p-3 border rounded-xl text-sm focus:ring-2 ring-blue-300 outline-none"
        />
        <button
          onClick={translate}
          className="bg-blue-600 text-white px-5 rounded-xl flex items-center justify-center hover:bg-blue-700 transition"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-700 text-sm mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="space-y-4 mt-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse p-4 border rounded-xl bg-gray-50 shadow-sm"
            >
              <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
              <div className="h-3 w-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* RESULTS */}
      {translations && (
        <div className="mt-6 space-y-4 max-h-[360px] overflow-y-auto pr-2">
          {translations.map((t, index) => (
            <div
              key={index}
              className="border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition relative"
            >
              {/* Top header */}
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium text-gray-500">
                  Result #{index + 1}
                </div>

                <div className="flex items-center gap-2">
                  <BadgeCheck className="text-green-600" size={16} />
                  <span className="text-[11px] bg-green-100 text-green-700 px-2 py-[2px] rounded-md">
                    Verified Mapping
                  </span>
                </div>
              </div>

              {/* Main codes */}
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Namaste */}
                <div>
                  <div className="text-[11px] font-bold text-gray-700 uppercase">
                    Namaste Code
                  </div>
                  <div className="text-blue-700 font-semibold text-base">
                    {t.namaste_code}
                  </div>
                  <div className="text-gray-600 text-xs mt-1 leading-snug">
                    {t.namaste_name_diacritical}
                  </div>
                </div>

                {/* ICD */}
                <div>
                  <div className="text-[11px] font-bold text-gray-700 uppercase">
                    ICD Code
                  </div>
                  <div className="text-green-700 font-semibold text-base">
                    {t.icd_code}
                  </div>
                  <div className="text-gray-600 text-xs mt-1 leading-snug">
                    {t.icd_name}
                  </div>
                </div>
              </div>

              {/* Expandable details */}
              <button
                onClick={() => toggleExpand(index)}
                className="mt-4 w-full flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {expanded[index] ? "Hide details" : "Show details"}
                {expanded[index] ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {expanded[index] && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border text-xs leading-relaxed">
                  <div>
                    <b>Full Description:</b>{" "}
                    {t.description || "No additional description."}
                  </div>
                  <div className="mt-2">
                    <b>Source:</b> Standardized TM2 Mapping (Namaste ↔ ICD-10)
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
