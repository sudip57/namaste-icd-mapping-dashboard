import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, ArrowRight, Database, Layers, Hash, MoveLeft, ChevronRight, XCircle } from "lucide-react";

const Searchbar = ({ baseurl }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query.trim()), 600);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch results
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setSelectedItem(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseurl}?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        const list = Array.isArray(data.results) ? data.results : [];
        setResults(list);
        setDropdownOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedQuery, baseurl]);

  // Click Outside handler
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 relative" ref={containerRef}>
      {/* SEARCH INPUT BAR */}
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search Namaste code, clinical description or ICD code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setDropdownOpen(true)}
          className="w-full h-16 pl-14 pr-32 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 size={18} className="animate-spin text-indigo-500 mr-2" />}
          <button
            className="h-10 px-5 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs hover:bg-slate-200 transition-colors uppercase tracking-widest flex items-center gap-2"
            onClick={() => {
              setDropdownOpen(false);
              setQuery("");
              setResults([]);
              setSelectedItem(null);
            }}
          >
            <XCircle size={14} /> Clear
          </button>
        </div>
      </div>

      {/* DROPDOWN RESULTS (Rich List style) */}
      {dropdownOpen && results.length > 0 && !selectedItem && (
        <div className="absolute left-4 right-4 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-h-[500px] overflow-y-auto z-[60] p-3 animate-in fade-in zoom-in-95 duration-200">
          <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 mb-2">
            Suggested Matches ({results.length})
          </p>
          {results.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 hover:bg-indigo-50/50 rounded-2xl cursor-pointer group transition-all"
              onClick={() => {
                setSelectedItem(item);
                setDropdownOpen(false);
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {item.namaste?.code}
                  </span>
                  <ArrowRight size={12} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {item.icd?.code}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {item.namaste?.name_diacritical || item.namaste?.description || "Unnamed Term"}
                </h4>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      )}

      {/* SEARCH EMPTY STATE */}
      {debouncedQuery && !loading && results.length === 0 && !selectedItem && (
        <div className="absolute left-4 right-4 mt-3 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 text-center">
          <p className="text-slate-400 text-sm font-medium italic">No mapping found for "{debouncedQuery}"</p>
        </div>
      )}

      {/* DETAILED SELECTION VIEW */}
      {selectedItem && (
        <div className="mt-8 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => {
              setSelectedItem(null);
              setDropdownOpen(true);
            }}
            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8 hover:gap-3 transition-all"
          >
            <MoveLeft size={16} /> Back to Search Results
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* NAMASTE CORE */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                  <Database size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Traditional Registry</h4>
                  <div className="text-2xl font-black text-slate-900 leading-tight">
                    <span className="text-indigo-600 mr-2">{selectedItem.namaste?.code}</span>
                    {selectedItem.namaste?.name_diacritical}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Discipline</p>
                    <p className="text-sm font-bold text-slate-700">{selectedItem.namaste?.discipline || "General"}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Indic Term</p>
                    <p className="text-sm font-bold text-slate-700 italic font-hindi">{selectedItem.namaste?.name_term_indic || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Detailed Description</p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-3xl border border-slate-100 italic">
                    "{selectedItem.namaste?.description || "No specific traditional clinical documentation available."}"
                  </p>
                </div>
              </div>
            </div>

            {/* ICD CLASSIFICATION */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Standard (ICD-11)</h4>
                  <div className="text-2xl font-black text-slate-900 leading-tight">
                    <span className="text-blue-600 mr-2">{selectedItem.icd?.code}</span>
                    {selectedItem.icd?.fullySpecifiedName}
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Classification Hierarchy</p>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    {selectedItem.icd?.path?.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm text-slate-500 uppercase tracking-tighter">
                          {p}
                        </span>
                        {i < selectedItem.icd.path.length - 1 && <span className="text-slate-300">›</span>}
                      </div>
                    )) || "—"}
                  </div>
                </div>
                
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Indexed Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.icd?.indexTerms?.map((t, i) => (
                      <span key={i} className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {t}
                      </span>
                    )) || <span className="text-slate-400 text-xs italic">None</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;