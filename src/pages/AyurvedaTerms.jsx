import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Search, 
  Loader2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Fingerprint, 
  Type, 
  BookOpen,
  Languages,
  Database
} from "lucide-react";

const BASE = "https://namaste-icd-microservice.vercel.app";

const WhoAyurvedaTerms = () => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [listLoading, setListLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchResults !== null) return;

    const fetchList = async () => {
      setListLoading(true);
      try {
        const res = await axios.get(`${BASE}/data/get-ayu-terms-data`, {
          params: { limit, page },
        });
        setListData(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };

    fetchList();
  }, [page, limit, searchResults]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setSearchResults(null);
    try {
      const res = await axios.get(`${BASE}/detailsOfAyuTerms`, {
        params: { q },
      });
      setSearchResults(res.data);
      setPage(1);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQ("");
    setSearchResults(null);
  };

  const TermCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const hasLongDesc = item.Description && item.Description.length > 140;

    return (
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <div className="flex flex-col gap-5">
          {/* Top Row: Meta Tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
                {item.TermID}
              </span>
              <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                <Type size={12} className="shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.Type || "General"}</span>
              </div>
            </div>
            <Languages size={18} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
          </div>

          {/* Main Terms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">English Term</p>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {item.English_term}
              </h3>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sanskrit (IAST)</p>
              <h3 className="text-lg font-bold text-indigo-600 leading-tight">
                {item.Sanskrit_term} <span className="text-slate-400 font-medium italic text-sm">[{item.Sanskrit_term_in_IAST}]</span>
              </h3>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          {/* Description Section */}
          <div className="relative">
            <div className="flex gap-2 mb-2">
              <BookOpen size={14} className="text-slate-400 shrink-0 mt-1" />
              <p className={`text-sm text-slate-600 leading-relaxed font-medium ${!expanded && "line-clamp-2"}`}>
                {item.Description || "No specific clinical description available in the registry."}
              </p>
            </div>
            {hasLongDesc && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mt-2 hover:text-indigo-800 transition-colors"
              >
                {expanded ? "Collapse Content" : "Expand Description"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-100">
              <Database size={14} /> Global Standard
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 ">
              WHO <span className="text-indigo-600">Ayurveda Terms</span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Explore the World Health Organization’s standardized terminology for 
              traditional medical symptoms, disorders, and diagnostic patterns.
            </p>
          </div>
        </div>

        {/* SEARCH BAR UNIT */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              className="w-full h-16 pl-14 pr-4 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-indigo-100/20 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 font-bold"
              placeholder="Search Sanskrit or English terms..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button className="bg-slate-900 hover:bg-slate-800 text-white px-10 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-slate-200">
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
          </button>

          {searchResults && (
            <button
              onClick={clearSearch}
              type="button"
              className="bg-red-50 text-red-600 px-5 rounded-[2rem] hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
            >
              <XCircle size={22} />
            </button>
          )}
        </form>

        {/* CONTENT AREA */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1 h-5 bg-indigo-600 rounded-full" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              {searchResults ? `Search Results (${searchResults.count})` : "Verified Registry Records"}
            </h2>
          </div>

          {searchResults && searchResults.count === 0 && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-20 text-center flex flex-col items-center">
              <XCircle size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No matches found for "{q}"</p>
            </div>
          )}

          {listLoading && !searchResults ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-indigo-500" size={48} />
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Accessing Ayurvedic Registry...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(searchResults ? searchResults.results : listData).map((item) => (
                <TermCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {/* PAGINATION COMPONENT */}
          {!searchResults && !listLoading && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-16 gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Page {page} <span className="text-slate-200 mx-2">/</span> {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-3 hover:bg-slate-50 rounded-2xl disabled:opacity-20 transition-all active:scale-90 border border-transparent hover:border-slate-100"
                >
                  <ChevronLeft size={24} className="text-slate-600" />
                </button>

                <div className="h-10 px-6 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-lg shadow-slate-200 tracking-widest">
                  CURRENT: {page}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 hover:bg-slate-50 rounded-2xl disabled:opacity-20 transition-all active:scale-90 border border-transparent hover:border-slate-100"
                >
                  <ChevronRight size={24} className="text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhoAyurvedaTerms;