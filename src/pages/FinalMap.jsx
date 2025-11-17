import React, { useEffect, useState } from "react";
import axios from "axios";
import Searchbar from "../components/Searchbar";
import { Loader2 } from "lucide-react";

const BASE = "https://namaste-icd-microservice.vercel.app";

const FinalMap = () => {
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch FINAL MAPPING DATASET
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

  // Final Mapping Table
  const Table = ({ rows }) => (
    <div className="overflow-x-auto border rounded-xl shadow mt-6">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">ICD Code</th>
            <th className="px-4 py-3">ICD Full Name</th>
            <th className="px-4 py-3">ICD Path</th>
            <th className="px-4 py-3">Namaste Code</th>
            <th className="px-4 py-3">Namaste Term</th>
            <th className="px-4 py-3">Namaste Description</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50 align-top">
              <td className="px-4 py-3 font-medium">{row.icd?.code || "-"}</td>

              <td className="px-4 py-3">
                {row.icd?.fullySpecifiedName || "-"}
              </td>

              <td className="px-4 py-3 text-gray-700 max-w-xs">
                <ul className="list-disc ml-4 space-y-1">
                  {row.icd?.path?.length
                    ? row.icd.path.map((p, i) => <li key={i}>{p}</li>)
                    : "—"}
                </ul>
              </td>

              <td className="px-4 py-3">{row.namaste?.code || "-"}</td>

              <td className="px-4 py-3">
                {row.namaste?.name_diacritical || "-"}
              </td>

              <td className="px-4 py-3 text-gray-700 max-w-xs">
                {row.namaste?.description || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Final Mapping Lookup
      </h1>
      <p className="text-gray-600 max-w-3xl mb-10">
        Search and explore the unified Namaste–ICD final mapping dataset. Use
        the search bar for instant fuzzy results, or browse the entire dataset
        below.
      </p>

      {/* SEARCHBAR */}
      <Searchbar baseurl="https://namaste-icd-microservice.vercel.app/lookup" />

      {/* FINAL MAPPING TABLE */}
      <h2 className="text-xl font-semibold mt-12 mb-4 text-gray-800">
        Full Final Mapping Dataset
      </h2>

      {listLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="text-gray-500 animate-spin" />
        </div>
      ) : (
        <Table rows={data} />
      )}

      {/* Pagination */}
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

      {/* INFO BOX */}
      <div className="bg-white border rounded-xl shadow p-6 mt-12">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          About Final Mapping
        </h3>
        <p className="text-gray-700 leading-relaxed">
          This dataset represents the final Namaste–ICD mapping after merging
          model results, LLM auto-validation, manual corrections, and SapBERT
          fine-tuning.
        </p>

        <ul className="list-disc ml-6 space-y-1 text-gray-700 mt-3">
          <li>~950 clean final mappings</li>
          <li>Includes ICD hierarchy, index terms, and full path</li>
          <li>Namaste diacritical + Sanskrit + English mapping</li>
          <li>Continuously improving with feedback and retraining</li>
        </ul>
      </div>
    </div>
  );
};

export default FinalMap;
