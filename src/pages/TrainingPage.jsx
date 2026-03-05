import { useState } from "react";
import axios from "axios";
import pako from "pako";
import { 
  CloudUpload, 
  Play, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  FileJson,
  Loader2
} from "lucide-react";

async function compressFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const compressed = pako.gzip(new Uint8Array(arrayBuffer));
  return new File([compressed], file.name + ".gz", { type: "application/gzip" });
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

  const uploadFile = async (file, type) => {
    const isPos = type === "pos";
    const setStatus = isPos ? setPosStatus : setNegStatus;
    const setUploaded = isPos ? setPosUploaded : setNegUploaded;
    const endpoint = isPos ? "pos-data" : "neg-data";
    const fieldName = isPos ? "pos-dataset" : "neg-dataset";

    if (!file) {
      setStatus(`Please select a ${type.toUpperCase()} file.`);
      return;
    }

    try {
      setStatus("Compressing engine...");
      const compressedFile = await compressFile(file);
      const formData = new FormData();
      formData.append(fieldName, compressedFile);

      setStatus("Uploading to pipeline...");
      const res = await axios.post(
        `https://namaste-icd-microservice.vercel.app/upload_training_data/${endpoint}`,
        formData
      );

      if (res.data.success) {
        setUploaded(true);
        setStatus(`${type.toUpperCase()} Synchronized ✔`);
      } else {
        setStatus("Upload protocol failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Nexus Connection Error.");
    }
  };

  const runTraining = async () => {
    setStreamOutput("Initializing fine-tuning environment...\n");
    setStreaming(true);
    try {
      await fetch("https://automated-training-mapping-pipeline.up.railway.app/run-training-job");
      const response = await fetch("https://automated-training-mapping-pipeline.up.railway.app/training-stream");

      if (!response.body) {
        setStreamOutput((p) => p + "❌ No streaming body received\n");
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
      setStreamOutput((prev) => prev + "\n❌ Stream error: " + err.message);
    }
    setStreaming(false);
  };

  const canTrain = posUploaded && negUploaded;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 flex flex-col items-center">
      {/* HEADER SECTION */}
      <div className="max-w-4xl w-full mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-100">
          <Cpu size={14} /> Training Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
          Model Training Panel
        </h1>
        <p className="text-slate-500 font-medium">
          Fine-tune the SapBERT architecture by providing positive and negative contrastive pairs.
        </p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: UPLOAD CONTROLS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-200">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <CloudUpload size={20} className="text-indigo-600" /> Dataset Ingestion
            </h2>

            {/* POS FILE INPUT */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Positive Samples (.jsonl)</label>
                {posUploaded && <CheckCircle2 size={16} className="text-emerald-500" />}
              </div>
              <div className={`relative group transition-all ${posUploaded ? 'opacity-50' : ''}`}>
                <input
                  type="file"
                  accept=".jsonl"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setPosFile(file);
                    uploadFile(file, "pos");
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-200 group-hover:border-indigo-400 rounded-2xl p-4 flex items-center gap-4 bg-slate-50 transition-colors">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                    <FileJson size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {posFile ? posFile.name : "Select POS Dataset"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                      {posStatus || "Waiting for file..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEG FILE INPUT */}
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negative Samples (.jsonl)</label>
                {negUploaded && <CheckCircle2 size={16} className="text-emerald-500" />}
              </div>
              <div className={`relative group transition-all ${negUploaded ? 'opacity-50' : ''}`}>
                <input
                  type="file"
                  accept=".jsonl"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setNegFile(file);
                    uploadFile(file, "neg");
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-200 group-hover:border-indigo-400 rounded-2xl p-4 flex items-center gap-4 bg-slate-50 transition-colors">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                    <FileJson size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {negFile ? negFile.name : "Select NEG Dataset"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                      {negStatus || "Waiting for file..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EXECUTION BUTTON */}
            <button
              onClick={runTraining}
              disabled={!canTrain || streaming}
              className={`group w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                canTrain && !streaming
                  ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              }`}
            >
              {streaming ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Play size={18} className={canTrain ? "fill-current" : ""} />
              )}
              {streaming ? "Engine Running" : "Execute Fine-Tuning"}
            </button>
            {!canTrain && !streaming && (
              <p className="text-center text-[10px] font-bold text-slate-400 mt-4 flex items-center justify-center gap-1">
                <AlertCircle size={12} /> Synchronize both files to enable training
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: LOG TERMINAL (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl flex flex-col h-full border border-slate-800">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <TerminalIcon size={14} /> Training_Stream.log
                </div>
              </div>
              {streaming && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-500 font-black uppercase">Live</span>
                </div>
              )}
            </div>

            {/* Log Body */}
            <div className="flex-1 overflow-y-auto p-8 font-mono text-[13px] leading-relaxed custom-scrollbar">
              {streamOutput ? (
                <pre className="text-indigo-400 whitespace-pre-wrap">
                  {streamOutput}
                  <span className="animate-pulse">_</span>
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                  <TerminalIcon size={48} className="mb-4" />
                  <p className="text-xs uppercase font-black tracking-widest">Awaiting execution...</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainingPage;