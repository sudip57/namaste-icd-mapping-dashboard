import { useState } from "react";
import axios from "axios";
import pako from "pako";
// -----------------------------
// Util: Compress File (.jsonl → .jsonl.gz)
// -----------------------------
async function compressFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const compressed = pako.gzip(new Uint8Array(arrayBuffer));

  return new File([compressed], file.name + ".gz", {
    type: "application/gzip",
  });
}

const TrainingPage = () => {
  const [posFile, setPosFile] = useState(null);
  const [negFile, setNegFile] = useState(null);

  const [posStatus, setPosStatus] = useState("");
  const [negStatus, setNegStatus] = useState("");
  const [posUploaded, setPosUploaded] = useState(false);
  const [negUploaded, setNegUploaded] = useState(false);

  const [streamOutput, setStreamOutput] = useState("");
  const [streaming, setStreaming] = useState(false);

  // -----------------------------
  // Upload POS
  // -----------------------------
  const uploadPos = async () => {
    if (!posFile) {
      setPosStatus("Please select a POS .jsonl file.");
      return;
    }

    try {
      setPosStatus("Compressing…");
      const compressedFile = await compressFile(posFile);

      const formData = new FormData();
      formData.append("pos-dataset", compressedFile);

      setPosStatus("Uploading…");

      const res = await axios.post(
        "https://namaste-icd-microservice.vercel.app/upload_training_data/pos-data",
        formData
      );

      if (res.data.success) {
        setPosUploaded(true);
        setPosStatus("POS data uploaded successfully ✔");
      } else {
        setPosStatus("POS upload failed.");
      }
    } catch (err) {
      console.error(err);
      setPosStatus("Error compressing or uploading POS file.");
    }
  };

  // -----------------------------
  // Upload NEG
  // -----------------------------
  const uploadNeg = async () => {
    if (!negFile) {
      setNegStatus("Please select a NEG .jsonl file.");
      return;
    }

    try {
      setNegStatus("Compressing…");
      const compressedFile = await compressFile(negFile);

      const formData = new FormData();
      formData.append("neg-dataset", compressedFile);

      setNegStatus("Uploading…");

      const res = await axios.post(
        "https://namaste-icd-microservice.vercel.app/upload_training_data/neg-data",
        formData
      );

      if (res.data.success) {
        setNegUploaded(true);
        setNegStatus("NEG data uploaded successfully ✔");
      } else {
        setNegStatus("NEG upload failed.");
      }
    } catch (err) {
      console.error(err);
      setNegStatus("Error compressing or uploading NEG file.");
    }
  };

  // -----------------------------
  // STREAM TRAINING JOB
  // -----------------------------
const runTraining = async () => {
  setStreamOutput("");
  setStreaming(true);

  try {
    // Start backend job
    await fetch("https://ayushlink-microservice-production.up.railway.app/run-training-job");

    // Start streaming logs
    const response = await fetch("https://ayushlink-microservice-production.up.railway.app/training-stream");

    if (!response.body) {
      setStreamOutput("❌ No streaming body received");
      setStreaming(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      setStreamOutput((prev) => prev + decoder.decode(value));
    }
  } catch (err) {
    console.error(err);
    setStreamOutput("❌ Stream error: " + err.message);
  }

  setStreaming(false);
};


  const canTrain = posUploaded && negUploaded;

  return (
    <>
  <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">

    {/* PAGE HEADER */}
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600  bg-clip-text">
        Training Panel
      </h1>
      <p className="text-gray-600 mt-2 max-w-2xl">
        Upload POS & NEG training datasets (JSONL), then run the model fine-tuning job.
      </p>
    </div>
    <div className="sm:flex w-full gap-4 justify-center">
    {/* UPLOAD CARD */}
    <div className="w-full max-w-3xl bg-white p-8 shadow-xl rounded-2xl border border-gray-200 space-y-10">

      {/* POS UPLOAD */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">POS Training Data (.jsonl)</h2>

        <label className="block">
          <input
            type="file"
            accept=".jsonl"
            onChange={(e) => {
              setPosFile(e.target.files[0]);
              setPosUploaded(false);
              setPosStatus("");
            }}
            className="w-full border bg-gray-50 text-gray-700 p-3 rounded-xl cursor-pointer 
                       file:bg-blue-600 file:text-white file:border-none file:px-5 file:py-2 file:rounded-l-xl
                       file:cursor-pointer"
          />
        </label>

        <button
          onClick={uploadPos}
          className="mt-3 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          Upload POS File
        </button>

        {posStatus && <p className="text-sm text-gray-700 mt-2">{posStatus}</p>}
      </div>

      <div className="border-t"></div>

      {/* NEG UPLOAD */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">NEG Training Data (.jsonl)</h2>

        <label className="block">
          <input
            type="file"
            accept=".jsonl"
            onChange={(e) => {
              setNegFile(e.target.files[0]);
              setNegUploaded(false);
              setNegStatus("");
            }}
            className="w-full border bg-gray-50 text-gray-700 p-3 rounded-xl cursor-pointer
                       file:bg-blue-600 file:text-white file:border-none file:px-5 file:py-2 file:rounded-l-xl"
          />
        </label>

        <button
          onClick={uploadNeg}
          className="mt-3 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          Upload NEG File
        </button>

        {negStatus && <p className="text-sm text-gray-700 mt-2">{negStatus}</p>}
      </div>

      <div className="border-t"></div>

      {/* TRAIN BUTTON */}
      <div className="w-full">
        <button
          onClick={runTraining}
          disabled={!canTrain || streaming}
          className={`w-full py-3 rounded-xl text-lg font-medium transition ${
            canTrain && !streaming
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {streaming ? "Training…" : "Start Training"}
        </button>
      </div>

    </div>

    {/* LOG TERMINAL */}
    <div className="w-full max-w-4xl bg-black text-green-400 p-6 mt-10 rounded-xl font-mono 
                    text-sm h-96 overflow-y-auto shadow-xl border border-gray-800">
      <h3 className="text-gray-300 font-bold mb-3">Training Logs</h3>
      <pre className="whitespace-pre-wrap">{streamOutput}</pre>
    </div>
  </div>
  </div>
  </>
);

};

export default TrainingPage;
