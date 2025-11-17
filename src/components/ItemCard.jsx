import { useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

export default function ItemCard({ item, index, sourceType }) {
  const [allData, setAllData] = useState([]);

  const sendToBackend = async (endpoint, data) => {
    try {
      await axios.post(
        `https://namaste-icd-microservice.vercel.app${endpoint}`,
        data
      );
    } catch (err) {
      console.error("Error sending data:", err);
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
    namaste = item.namaste;
    matches = item.icd ? [{ icd_entry: item.icd }] : [];
  }

  if (!namaste) return null;

  const handleAccept = (namaste, icd, sim) => {
    const data = buildPayload(namaste, icd, sim, 1);
    const route =
      sourceType === "final" ? "/approve/final_map" : "/tempMap/accept";
    setAllData((prev) => [...prev, data]);
    sendToBackend(route, data);
  };

  const handleReject = (namaste, icd, sim) => {
    const data = buildPayload(namaste, icd, sim, 0);
    setAllData((prev) => [...prev, data]);
    sendToBackend("/tempMap/reject", data);
  };

  return (
    <div className="rounded-2xl shadow-md border border-gray-200 bg-white  mb-6 transition hover:shadow-lg">
      {/* HEADER */}
      <div className="px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-semibold tracking-wide">
        Mapping #{index + 1}
      </div>

      {/* NAMASTE SECTION */}
      <div className="px-6 py-5 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">
          Namaste Entry
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600 mb-1">Code</p>
            <p className="bg-white p-2 rounded-lg border">{namaste.code}</p>
          </div>

          <div>
            <p className="font-medium text-gray-600 mb-1">Discipline</p>
            <p className="bg-white p-2 rounded-lg border">
              {namaste.discipline}
            </p>
          </div>

          <div className="col-span-2">
            <p className="font-medium text-gray-600 mb-1">Terms</p>
            <p className="bg-white p-2 rounded-lg border leading-relaxed">
              {namaste.name_diacritical ||
                namaste.name_diacritical_cleaned ||
                ""}
              {namaste.name_term_indic ? ` • ${namaste.name_term_indic}` : ""}
            </p>
          </div>

          <div className="col-span-2">
            <p className="font-medium text-gray-600 mb-1">Description</p>
            <p className="bg-white p-2 rounded-lg border leading-relaxed">
              {namaste.description ||
                namaste.Long_definition ||
                namaste.Short_definition ||
                "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ICD MATCHES */}
      <div className="px-6 py-5">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          ICD Matches
        </h2>

        {matches.length === 0 ? (
          <p className="text-gray-500 text-sm">No ICD matches found.</p>
        ) : (
          <div className="space-y-4">
            {matches.map((match, i) => {
              const icd = match.icd_entry || match.icd || {};

              const geminiSim = match.gemini_result?.similarity_score ?? null;
              const modelSim = match.similarity ?? null;

              return (
                <div
                  key={i}
                  className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {icd.code}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {icd.fullySpecifiedName}
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-2 justify-end w-full">
                      <button
                        onClick={() => handleAccept(namaste, icd, modelSim)}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm w-full sm:w-auto justify-center"
                      >
                        <Check size={16} /> Approve
                      </button>

                      <button
                        onClick={() => handleReject(namaste, icd, modelSim)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm w-full sm:w-auto justify-center"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <p className="text-gray-600 text-sm mb-3">
                    {icd.description || "—"}
                  </p>

                  <div className="text-xs text-gray-500 mb-3">
                    {Array.isArray(icd.path) ? icd.path.join(" › ") : "No path"}
                  </div>

                  {/* SIMILARITY BADGES */}
                  <div className="flex gap-3 mt-2">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                      Gemini: {geminiSim ?? "—"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                      Model: {modelSim ?? "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
