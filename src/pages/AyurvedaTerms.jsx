import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Loader2, XCircle } from "lucide-react";

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

  // Fetch paginated list data (default dataset)
  useEffect(() => {
    if (searchResults !== null) return; // DO NOT LOAD LIST WHEN SEARCH ACTIVE

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

  // Handle search
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
      setPage(1); // reset pagination
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and return to full list
  const clearSearch = () => {
    setQ("");
    setSearchResults(null);
  };

  // TABLE COMPONENT
  const Table = ({ rows }) => (
    <div className="overflow-x-auto border rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3">TermID</th>
            <th className="px-4 py-3">English Term</th>
            <th className="px-4 py-3">Sanskrit</th>
            <th className="px-4 py-3">IAST</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{item.TermID}</td>
              <td className="px-4 py-3 font-medium">{item.English_term}</td>
              <td className="px-4 py-3">{item.Sanskrit_term}</td>
              <td className="px-4 py-3 text-gray-600">{item.Sanskrit_term_in_IAST}</td>
              <td className="px-4 py-3 text-gray-500">{item.Type}</td>
              <td className="px-4 py-3 text-gray-600 max-w-sm">
                {item.Description && item.Description.trim() !== ""
                  ? item.Description
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">WHO Ayurveda Terms</h1>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          placeholder="Search Ayurvedic terms..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 rounded-lg flex items-center">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </button>

        {searchResults && (
          <button
            onClick={clearSearch}
            type="button"
            className="bg-gray-200 px-4 rounded-lg flex items-center"
          >
            <XCircle size={20} className="text-gray-600" />
          </button>
        )}
      </form>

      {/* SEARCH RESULTS */}
      {searchResults && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">
            Search Results ({searchResults.count})
          </h2>

          {searchResults.count > 0 ? (
            <Table rows={searchResults.results} />
          ) : (
            <div className="text-gray-500">No results found.</div>
          )}
        </div>
      )}

      {/* FULL LIST (only when NOT searching) */}
      {!searchResults && (
        <>
          <h2 className="text-xl font-semibold mb-3">All Ayurveda Terms</h2>

          {listLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-500" size={30} />
            </div>
          ) : (
            <Table rows={listData} />
          )}

          {/* PAGINATION */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-4 py-1 bg-white border rounded">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WhoAyurvedaTerms;
