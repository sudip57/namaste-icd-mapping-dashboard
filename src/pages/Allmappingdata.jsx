import { useState, useEffect, useRef } from "react";
import ItemCard from "../components/ItemCard";
import { Search, Filter, ChevronLeft, ChevronRight, XCircle, Database, LayoutGrid } from "lucide-react";

export default function AllMappingDataPage() {
  const BASE = "https://namaste-icd-microservice.vercel.app/data";
  const listRef = useRef();

  const [sourceType, setSourceType] = useState("llm");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lowerBound, setLowerBound] = useState(0);
  const [upperBound, setUpperBound] = useState(1);
  const limit = 100;
  const [loading, setLoading] = useState(false);
  const [mappingData, setMappingData] = useState([]);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const fetchMappingData = async () => {
    try {
      setLoading(true);
      let endpoint = "";
      if (sourceType === "llm") endpoint = `${BASE}/get-LLM-data`;
      else if (sourceType === "sapbert") endpoint = `${BASE}/get-embedding-data`;
      else if (sourceType === "final") endpoint = `${BASE}/get-final-data`;

      const res = await fetch(
        `${endpoint}?page=${currentPage}&limit=${limit}&lowerbound=${lowerBound}&upperbound=${upperBound}`
      );
      const json = await res.json();
      setTotalPages(json.totalPages || 1);
      setMappingData(json.data || []);
      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!search.trim()) return;
    try {
      setLoading(true);
      setSearching(true);
      const res = await fetch(`https://namaste-icd-microservice.vercel.app/experimental/search?q=${encodeURIComponent(search.trim())}`);
      const json = await res.json();
      const data = Array.isArray(json) ? json[0] : json;
      let results = data.results || json.results || (Array.isArray(json) ? json : []);
      
      results = results.map((item) => ({
        ...item,
        namaste_entry: item.namaste_entry || item.namaste || {},
        top_matches: item.top_matches || item.matches || [],
        icd: item.icd || null,
      }));

      setSearchResults(results);
      if (results.length > 0) setMappingData([]);
      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearching(false);
    setSearch("");
    setSearchResults([]);
    setMappingData([]);
    setCurrentPage(1);
    fetchMappingData();
  };

  useEffect(() => {
    if (searching) return;
    fetchMappingData();
  }, [sourceType, currentPage]); // Bounds handled by "Apply" button to prevent flickering

  useEffect(() => { setCurrentPage(1); }, [sourceType]);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* --- DASHBOARD HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-5">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                  <Database size={20} />
               </div>
               <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Mapping Registry</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {searching ? "Search Results" : `Source: ${sourceType} dataset`}
                  </p>
               </div>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center gap-2 flex-1 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && performSearch()}
                  placeholder="Enter Namaste or ICD terms..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-100 border-transparent rounded-[14px] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                />
              </div>
              <button
                onClick={searching ? clearSearch : performSearch}
                className={`h-12 px-6 rounded-[14px] font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                  searching ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {searching ? <><XCircle size={16}/> Clear</> : "Search"}
              </button>
            </div>
          </div>

          {/* Filters Area */}
          {!searching && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button 
                    onClick={() => setSourceType("llm")}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${sourceType === 'llm' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >LLM</button>
                  <button 
                    onClick={() => setSourceType("sapbert")}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${sourceType === 'sapbert' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >SapBERT</button>
                  <button 
                    onClick={() => setSourceType("final")}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${sourceType === 'final' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >Final</button>
                </div>

                <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Similarity Range</span>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <input
                      type="number"
                      step="0.1"
                      value={lowerBound}
                      onChange={(e) => setLowerBound(Number(e.target.value))}
                      className="w-14 text-center text-xs font-bold py-2 outline-none"
                    />
                    <div className="text-slate-300 px-1 font-bold">-</div>
                    <input
                      type="number"
                      step="0.1"
                      value={upperBound}
                      onChange={(e) => setUpperBound(Number(e.target.value))}
                      className="w-14 text-center text-xs font-bold py-2 outline-none border-l border-slate-100"
                    />
                  </div>
                  <button
                    onClick={() => { setCurrentPage(1); fetchMappingData(); }}
                    className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-90"
                  >
                    <Filter size={16} />
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-900">{(searching ? searchResults : mappingData).length}</span> Records in view
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <main 
        ref={listRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-48 bg-white border border-slate-100 rounded-[24px] p-8 flex flex-col gap-4 animate-pulse">
                  <div className="h-4 w-1/4 bg-slate-100 rounded-full" />
                  <div className="h-8 w-1/2 bg-slate-50 rounded-full" />
                  <div className="h-20 w-full bg-slate-50 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 pb-20">
              {(searching ? searchResults : mappingData).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <LayoutGrid size={48} className="mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">No records found for this criteria</p>
                </div>
              ) : (
                (searching ? searchResults : mappingData).map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    index={index}
                    sourceType={searching ? "search" : sourceType}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- PAGINATION BAR --- */}
      {!searching && (
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</span>
              <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-bold text-slate-600">
                Page {currentPage} / {totalPages}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl disabled:opacity-20 transition-all active:scale-90 border border-transparent hover:border-slate-200"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20}/>
              </button>

              <div className="flex items-center gap-1.5 mx-2">
                {(() => {
                  const pages = [];
                  const range = 1; 
                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`min-w-[40px] h-10 px-2 rounded-xl text-[11px] font-black transition-all shadow-sm ${
                            currentPage === i
                              ? "bg-slate-900 text-white shadow-slate-300 scale-105"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-400"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
                      pages.push(<span key={`sep-${i}`} className="px-1 text-slate-300 font-bold">...</span>);
                    }
                  }
                  return pages;
                })()}
              </div>

              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl disabled:opacity-20 transition-all active:scale-90 border border-transparent hover:border-slate-200"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}