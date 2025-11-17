import React, { useState, useEffect, useRef } from "react";

const Searchbar = (props) => {
  const {baseurl} = props;
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // controls dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef(null);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 800);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setSelectedItem(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseurl}?q=${encodeURIComponent(
            debouncedQuery
          )}`
        );
        const data = await res.json();

        const list = Array.isArray(data.results) ? data.results : [];
        setResults(list);
        setSelectedItem(null);
        setDropdownOpen(true); // show dropdown
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
        setSelectedItem(null);
        setDropdownOpen(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative" ref={containerRef}>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search Namaste code, description or ICD code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setDropdownOpen(true);
          }}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="px-3 py-3 rounded-xl border border-gray-300 bg-gray-600 text-white shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            setDropdownOpen(false);
            setQuery("");
            setResults([]);
            setSelectedItem(null);
          }}
        >
          Clear
        </button>
      </div>
      {/* SHOW LOADING BELOW SEARCH BAR */}
      {loading && !selectedItem && (
        <div
          className="absolute left-0 right-0 mt-2 text-gray-600 text-sm bg-white p-4 
                  rounded-xl shadow-md border z-50"
        >
          Searching…
        </div>
      )}

      {/* FLOATING RESULTS (Option A) */}
      {dropdownOpen && !loading && results.length > 0 && !selectedItem && (
        <div
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border 
                     max-h-[600px] overflow-y-auto z-50 p-4"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-left">
                <th className="py-3 px-4 font-semibold">Namaste Code</th>
                <th className="py-3 px-4 font-semibold">Namaste Term</th>
                <th className="py-3 px-4 font-semibold w-1/2">
                  Namaste Description
                </th>
                <th className="py-3 px-4 font-semibold">ICD Code</th>
                <th className="py-3 px-4 font-semibold">ICD Description</th>
              </tr>
            </thead>

            <tbody>
              {results.map((item, idx) => {
                const nam = item.namaste || {};
                const icd = item.icd || {};
                return (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 cursor-pointer align-top"
                    onClick={() => {
                      setSelectedItem(item);
                      setDropdownOpen(false); // CLOSE DROPDOWN → SHOW DETAIL
                    }}
                  >
                    <td className="py-3 px-4">{nam.code || "-"}</td>
                    <td className="py-3 px-4">{nam.name_diacritical || "-"}</td>
                    <td className="py-3 px-4">{nam.description || "-"}</td>
                    <td className="py-3 px-4">{icd.code || "-"}</td>
                    <td className="py-3 px-4">
                      {icd.fullySpecifiedName || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && debouncedQuery && results.length === 0 && !selectedItem && (
        <div
          className="absolute left-0 right-0 mt-2 text-gray-600 text-sm bg-white p-4 
                        rounded-xl shadow-md border z-50"
        >
          No results found.
        </div>
      )}
{selectedItem && (
  <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

    {/* Back Button */}
    <button
      onClick={() => {
        setSelectedItem(null);
        if (results.length > 0) setDropdownOpen(true);
      }}
      className="text-blue-600 hover:underline text-sm font-medium mb-6 inline-flex items-center"
    >
      <span className="mr-1">←</span> Back to results
    </button>

    {/* Title */}
    <h3 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
      Mapping Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* NAMASTE CARD */}
      <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900">Namaste</h4>

        <div className="text-gray-700 text-sm space-y-2">
          <p><span className="font-semibold text-gray-900">Code:</span> {selectedItem.namaste?.code || "-"}</p>
          <p><span className="font-semibold text-gray-900">Term:</span> {selectedItem.namaste?.name_diacritical || "-"}</p>
          <p><span className="font-semibold text-gray-900">Description:</span> {selectedItem.namaste?.description || "-"}</p>
          <p><span className="font-semibold text-gray-900">Discipline:</span> {selectedItem.namaste?.discipline || "-"}</p>
          <p><span className="font-semibold text-gray-900">Term Indic:</span> {selectedItem.namaste?.name_term_indic || "-"}</p>
        </div>
      </div>

      {/* ICD CARD */}
      <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900">ICD</h4>

        <div className="text-gray-700 text-sm space-y-2">
          <p><span className="font-semibold text-gray-900">Code:</span> {selectedItem.icd?.code || "-"}</p>
          <p><span className="font-semibold text-gray-900">Description:</span> {selectedItem.icd?.fullySpecifiedName || "-"}</p>

          <div>
            <p className="font-semibold text-gray-900 mb-1">Path:</p>
            <ul className="list-disc list-inside ml-3 max-h-36 overflow-y-auto bg-white border p-2 rounded-md">
              {selectedItem.icd?.path?.length
                ? selectedItem.icd.path.map((p, i) => <li key={i}>{p}</li>)
                : <li>-</li>}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">Index Terms:</p>
            <div className="max-h-40 overflow-y-auto bg-white border p-2 rounded-md">
              <ul className="list-disc list-inside space-y-1 ml-3">
                {selectedItem.icd?.indexTerms?.length
                  ? selectedItem.icd.indexTerms.map((t, i) => <li key={i}>{t}</li>)
                  : <li>-</li>}
              </ul>
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
