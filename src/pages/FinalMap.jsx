import React, { useEffect, useState } from "react";
import axios from "axios";
import Searchbar from "../components/Searchbar";
import { Loader2, ArrowRight, BookOpen, Layers, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const BASE = "https://namaste-icd-microservice.vercel.app";

const FinalMap = () => {
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(15); // Smaller limit for better card grid layout
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setListLoading(true);
      try {
        const res = await axios.get(`${BASE}/data/final-Map`, {
          params: { limit, page },
        });
        setData(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Final data error:", err);
      } finally {
        setListLoading(false);
      }
    };
    loadData();
  }, [page, limit]);
  console.log(data)
  // Modern Mapping Card
  const MappingCard = ({ row }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
        {/* Top: Header with Codes */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded">Namaste: {row.namaste?.code || "N/A"}</span>
            <ArrowRight size={14} className="text-slate-300" />
            <span className="text-[12px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded">ICD: {row.icd?.code || "N/A"}</span>
          </div>
          <CheckCircle2 size={16} className="text-emerald-500" />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Content Split */}
          <div className="grid grid-cols-1 gap-4">
            {/* Namaste Side */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight mb-1 uppercase">
                {row.namaste?.name||row.namaste?.name_diacritical_cleaned ||row.namaste?.name_diacritical || "Unnamed Term"}
              </h3>
              <p className={`text-xs text-slate-500 leading-relaxed ${!expanded && "line-clamp-2"}`}>
                {row.namaste?.description || "No description provided."}
              </p>
            </div>

            <div className="h-[1px] bg-slate-100 w-full"></div>

            {/* ICD Side */}
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Layers size={12} /> Target Classification
              </p>
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                {row.icd?.fullySpecifiedName || "No matching name"}
              </h4>
              
              {/* ICD Path as Breadcrumbs */}
              <div className="flex flex-wrap gap-1">
                {row.icd?.path?.slice(0, 3).map((p, i) => (
                  <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    {p}
                  </span>
                ))}
                {row.icd?.path?.length > 3 && <span className="text-[9px] text-slate-400">+{row.icd.path.length - 3} more</span>}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-center text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
          >
            {expanded ? "Show Less" : "View Full Mapping Details"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Final Mapping Lookup
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Explore the validated Namaste–ICD dataset. This repository contains the gold-standard 
              mappings refined through SapBERT fine-tuning and expert validation.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">~950 Validated Mappings</span>
          </div>
        </div>

        {/* SEARCHBAR WRAPPER */}
        <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 mb-12">
          <Searchbar baseurl={`${BASE}/lookup`} />
        </div>

        {/* DATA GRID */}
        <div className="mb-6 flex items-center justify-between px-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            Verified Dataset Browse
          </h2>
        </div>

        {listLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={40} className="text-indigo-600 animate-spin" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((row, idx) => (
                <MappingCard key={idx} row={row} />
              ))}
            </div>

            {/* MODERN PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Showing Page {page} of {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronLeft size={24} className="text-slate-600" />
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        page === i + 1 ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronRight size={24} className="text-slate-600" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* BOTTOM INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-lg shadow-indigo-200">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <BookOpen size={24} /> Methodology
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">
              Our final mapping is achieved through a multi-stage validation pipeline combining 
              Sanskrit Natural Language Processing and medical standard alignment.
            </p>
            <ul className="space-y-2 text-xs font-bold uppercase tracking-wide">
              <li className="flex items-center gap-2 opacity-80"><div className="w-1.5 h-1.5 bg-white rounded-full" /> SapBERT Fine-Tuning</li>
              <li className="flex items-center gap-2 opacity-80"><div className="w-1.5 h-1.5 bg-white rounded-full" /> LLM-based Consistency Check</li>
              <li className="flex items-center gap-2 opacity-80"><div className="w-1.5 h-1.5 bg-white rounded-full" /> Human Expert Audit</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Dataset Coverage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Coverage</p>
                <p className="text-2xl font-black text-slate-900">~950</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Hierarchy Levels</p>
                <p className="text-2xl font-black text-slate-900">5+</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed italic">
              * This dataset is updated weekly based on the latest feedback from the 
              Namaste-ICD auto-validation engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalMap;