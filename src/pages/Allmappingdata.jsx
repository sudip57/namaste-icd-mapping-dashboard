import { useState, useEffect, useRef } from "react";
import ItemCard from "../components/ItemCard";

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

  // SEARCH STATE
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // ---------------------------------------------------
  // FETCH NORMAL PAGINATED DATA
  // ---------------------------------------------------
  const fetchMappingData = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      if (sourceType === "llm") endpoint = `${BASE}/get-LLM-data`;
      else if (sourceType === "sapbert")
        endpoint = `${BASE}/get-embedding-data`;
      else if (sourceType === "final") endpoint = `${BASE}/get-final-data`;

      const res = await fetch(
        `${endpoint}?page=${currentPage}&limit=${limit}&lowerbound=${lowerBound}&upperbound=${upperBound}`
      );

      const json = await res.json();

      setTotalPages(json.totalPages || 1);
      setMappingData(json.data || []);

      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      console.error("Error fetching mapping data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // SEARCH FUNCTION
  // ---------------------------------------------------
  const performSearch = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);
      setSearching(true);

      const res = await fetch(
        `https://namaste-icd-microservice.vercel.app/experimental/search?q=${encodeURIComponent(
          search.trim()
        )}`
      );

      const json = await res.json();
      console.log("RAW SEARCH RESPONSE:", json);

      // Normalize top-level response
      const data = Array.isArray(json) ? json[0] : json;

      // 🔥 Fix shape: if API returned object instead of results array
      let results = [];

      if (Array.isArray(data.results)) {
        results = data.results;
      } else if (Array.isArray(json.results)) {
        results = json.results;
      } else if (Array.isArray(json)) {
        results = json;
      } else if (data && typeof data === "object") {
        // If backend sent a single document instead of results array
        if (data.namaste_entry || data.top_matches) {
          results = [data];
        }
      }

      console.log("NORMALIZED RESULTS:", results);

      // 🔥 Normalize structure so ItemCard never breaks
      results = results.map((item) => ({
        ...item,
        namaste_entry: item.namaste_entry || item.namaste || {},
        top_matches: item.top_matches || item.matches || [],
        icd: item.icd || null,
      }));

      setSearchResults(results);

      if (results.length > 0) {
        setMappingData([]);
      }

      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // RESET SEARCH
  // ---------------------------------------------------
  const clearSearch = () => {
    setSearching(false);
    setSearch("");
    setSearchResults([]);
    setMappingData([]);
    setCurrentPage(1);
    fetchMappingData();
  };

  // ---------------------------------------------------
  // NORMAL DATA MODE: FETCH ONLY WHEN NOT SEARCHING
  // ---------------------------------------------------
  useEffect(() => {
    if (searching) return; // stop unwanted reloads
    fetchMappingData();
  }, [sourceType, currentPage, lowerBound, upperBound]);

  // Reset page when changing sourceType
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceType]);

  return (
    <>
      {/* TOP NAV + SEARCH */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-5 py-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
              placeholder="Search Namaste / ICD terms…"
              className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition outline-none shadow-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              🔎
            </span>
          </div>

          {/* Search / Clear Button */}
          {!searching ? (
            <button
              onClick={performSearch}
              className="h-12 px-6 bg-black text-white rounded-2xl shadow hover:bg-gray-900 transition font-medium"
            >
              Search
            </button>
          ) : (
            <button
              onClick={clearSearch}
              className="h-12 px-6 bg-red-600 text-white rounded-2xl shadow hover:bg-red-700 transition font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR */}
      {!searching && (
        <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-5 py-3 flex flex-wrap justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">Source:</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none shadow-sm"
              >
                <option value="llm">LLM Mapping</option>
                <option value="sapbert">SapBERT Mapping</option>
                <option value="final">Final Mapping</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">Similarity:</label>

              <input
                type="number"
                value={lowerBound}
                onChange={(e) => setLowerBound(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-100 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />

              <input
                type="number"
                value={upperBound}
                onChange={(e) => setUpperBound(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-100 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />

              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchMappingData();
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="max-w-8xl mx-auto mt-4 px-5">
        {/* MAIN LIST */}
        <div
          ref={listRef}
          className="
    h-[75vh]
    overflow-y-scroll
    m-4
    p-4
    bg-white
    rounded-2xl
    shadow-[0_2px_8px_rgba(0,0,0,0.06)]
    flex flex-col gap-4
    scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500
  "
          style={{
            maxWidth: "100%",
          }}
        >
          {loading ? (
            <div className="space-y-6 p-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 shadow rounded-2xl h-32"
                ></div>
              ))}
            </div>
          ) : searching ? (
            searchResults.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                No results found.
              </p>
            ) : (
              searchResults.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  index={index}
                  sourceType="search"
                />
              ))
            )
          ) : mappingData.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No data found.</p>
          ) : (
            mappingData.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                index={index}
                sourceType={sourceType}
              />
            ))
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {!searching && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t shadow-lg py-3 mt-2">
          <div className="max-w-6xl mx-auto flex justify-center gap-2 px-2 overflow-x-auto">
            {(() => {
              const windowSize = 10;
              const start =
                Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
              const end = Math.min(start + windowSize - 1, totalPages);

              const pages = [];

              // back
              pages.push(
                <button
                  key="prev-win"
                  onClick={() =>
                    setCurrentPage(Math.max(1, start - windowSize))
                  }
                  disabled={start === 1}
                  className="px-4 py-2 rounded-xl border bg-gray-100 disabled:opacity-40"
                >
                  ‹
                </button>
              );

              // numbers
              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 rounded-xl border ${
                      currentPage === i
                        ? "bg-black text-white shadow"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              // next
              pages.push(
                <button
                  key="next-win"
                  onClick={() => setCurrentPage(Math.min(totalPages, end + 1))}
                  disabled={end >= totalPages}
                  className="px-4 py-2 rounded-xl border bg-gray-100 disabled:opacity-40"
                >
                  ›
                </button>
              );

              return pages;
            })()}
          </div>
        </div>
      )}
    </>
  );
}
