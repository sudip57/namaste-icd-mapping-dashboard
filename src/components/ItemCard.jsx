import { useState } from "react";
import axios from "axios";
import {
  Check,
  X,
  Brain,
  Target,
  Activity,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  FileText,
} from "lucide-react";

export default function ItemCard({ item, index, sourceType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);

  const sendToBackend = async (endpoint, data) => {
    try {
      await axios.post(
        `https://namaste-icd-microservice.vercel.app${endpoint}`,
        data,
      );
      setActionStatus(endpoint.includes("accept") ? "approved" : "rejected");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const buildPayload = (namaste, icd, sim = null, label) => ({
    id: `${namaste.code}-${icd.code}`,
    namaste,
    icd,
    similarity: sim,
    label,
  });

  let namaste;
  let matches = [];

 if (["llm", "sapbert", "search"].includes(sourceType)) {
  namaste = item.namaste_entry;
  matches = item.top_matches || [];
} else {
  // Logic for "final" or "manual" entries
  namaste = item.namaste || item.namaste_entry; 
  // Ensure we capture similarity if it exists on the root item
  matches = item.icd ? [{ 
    icd_entry: item.icd, 
    similarity: item.similarity || item.score || 0 // Capture the score here
  }] : [];
}

  if (!namaste) return null;

  // Identify the best score for the preview
  const topMatch = matches[0] || {};
  const topIcd = topMatch.icd_entry || topMatch.icd || {};
  const topScore = Math.max(
    topMatch.gemini_result?.similarity_score || 0,
    topMatch.similarity || 0,
    topMatch.sapbert_score || 0,
  );

  const getScoreColor = (score) => {
    if (score >= 0.85)
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 0.7) return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div
      className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
        actionStatus === "approved"
          ? "border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-50"
          : actionStatus === "rejected"
            ? "border-red-400 opacity-60"
            : "border-slate-200 hover:border-indigo-300"
      }`}
    >
      {/* 1. COMPACT TOP BAR */}
      <div
        className="px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded shrink-0">
            #{index + 1}
          </span>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-indigo-500 font-mono block leading-none mb-1 uppercase tracking-tighter">
              {namaste.code || "NO-CODE"}
            </span>
            <h2 className="text-sm font-extrabold text-slate-800 truncate uppercase tracking-tight">
              {namaste.name_diacritical_cleaned ||
                namaste.NAMC_TERM ||
                namaste.NUMC_TERM ||
                namaste.NAMC_term ||
                namaste.name_diacritical ||
                "Unnamed Term"}
            </h2>
          </div>
        </div>

        {/* Top Match Preview */}
        {!isExpanded && topIcd.code && (
          <div className="flex items-center gap-3 flex-1 px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in duration-500">
            <ArrowRight size={14} className="text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">
                Top Match
              </p>
              <p className="text-[11px] font-bold text-slate-700 truncate">
                <span className="text-blue-600 mr-1">{topIcd.code}</span>
                {topIcd.fullySpecifiedName}
              </p>
            </div>
            <div
              className={`ml-auto px-2 py-0.5 rounded text-[10px] font-black border ${getScoreColor(topScore)}`}
            >
              {topScore.toFixed(3)}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-all">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? "COLLAPSE" : "DETAILS"}
          </button>
        </div>
      </div>

      {/* 2. EXPANDABLE CONTENT */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-4 border-t border-slate-50 bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
          {/* Namaste Source Definition */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-2 flex items-center gap-2">
              <BookOpen size={14} /> Ayurveda/Unani Context
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {namaste.description ||
                namaste.Long_definition ||
                namaste.Short_definition ||
                "Extended medical definition not available for this source entry."}
            </p>
          </div>

          {/* ICD Matching Candidates List */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Proposed ICD-11 Mappings
            </h4>
            {matches.map((match, i) => {
              const icd = match.icd_entry || match.icd || {};
              const geminiSim = match.gemini_result?.similarity_score ?? 0;
              const modelSim = match.similarity ?? 0;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group/match hover:border-indigo-300 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                          ICD: {icd.code}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          {icd.fullySpecifiedName}
                        </h3>
                      </div>

                      {/* ICD Description - Added here */}
                      <div className="flex gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        <FileText
                          size={14}
                          className="text-slate-400 shrink-0 mt-1"
                        />
                        <div className="flex flex-col gap-1 w-full">
                          {/* Dynamic Label */}
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {icd.description
                              ? "Clinical Index"
                              : "Classification Path"}
                          </p>
                          <div className="text-xs text-slate-600 leading-relaxed italic">
                            {icd.description ? (
                              icd.description
                            ) : Array.isArray(icd.path) &&
                              icd.path.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-y-2 gap-x-1 mt-1">
                                {icd.path.map((step, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1"
                                  >
                                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 not-italic font-semibold text-[10px] shadow-sm">
                                      {step}
                                    </span>
                                    {index < icd.path.length - 1 && (
                                      <span className="text-slate-300 not-italic font-bold ml-0.5">
                                        ›
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              "No clinical metadata found for this code."
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Triple Sim Scores */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {sourceType != "llm" && sourceType != "final" ?(<div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black ${getScoreColor(modelSim)}`}
                        >
                          <Target size={12} /> SAPBERT: {modelSim.toFixed(3)}
                        </div>):(<><div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black ${getScoreColor(geminiSim)}`}
                        >
                          <Brain size={12} /> GEMINI: {geminiSim.toFixed(3)}
                        </div> 
                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black ${getScoreColor(modelSim)}`}
                        >
                          <Target size={12} /> SAPBERT: {modelSim}
                        </div></>
                      )}
                      </div>
                    </div>
                    {/* Approve/Reject Buttons */}
                    <div className="flex lg:flex-col gap-2 shrink-0 self-center">
                      <button
                        onClick={() => {
                          const data = buildPayload(namaste, icd, modelSim, 1);
                          sendToBackend(
                            sourceType === "final"
                              ? "/approve/final_map"
                              : "/tempMap/accept",
                            data,
                          );
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-xs shadow-lg shadow-emerald-50 transition-all active:scale-95"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        onClick={() => {
                          const data = buildPayload(namaste, icd, modelSim, 0);
                          sendToBackend("/tempMap/reject", data);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl hover:bg-red-50 font-bold text-xs transition-all active:scale-95"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
