import { useEffect, useState, useRef } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Terminal as TerminalIcon, 
  Play, 
  Trash2, 
  Cpu, 
  History, 
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AutoValidation() {
  const [logs, setLogs] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const pollingRef = useRef(null);
  const lastSizeRef = useRef(0);
  const logBoxRef = useRef(null);

  const BASE = "https://ayushlink-microservice.onrender.com";

  useEffect(() => {
    init();
    return () => stopPolling();
  }, []);

  const init = async () => {
    const running = await checkStatus();
    await loadInitialLog();
    if (running) startPolling();
  };

  const checkStatus = async () => {
    const res = await fetch(`${BASE}/validation-status`);
    const data = await res.json();
    setIsRunning(data.running);
    return data.running;
  };

  const loadInitialLog = async () => {
    const res = await fetch(`${BASE}/validation-log`);
    const data = await res.json();
    const text = data.log || "";
    lastSizeRef.current = text.length;
    setLogs(text);
    scrollToBottom();
  };

  const pollAppend = async () => {
    const res = await fetch(`${BASE}/validation-log`);
    const data = await res.json();
    const text = data.log || "";
    const oldSize = lastSizeRef.current;
    const newSize = text.length;

    if (newSize > oldSize) {
      const newChunk = text.substring(oldSize);
      setLogs((prev) => prev + newChunk);
      lastSizeRef.current = newSize;
      scrollToBottom();
    }
  };

  const startPolling = () => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      const running = await checkStatus();
      await pollAppend();
      if (!running) stopPolling();
    }, 700);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startValidation = async () => {
    const res = await fetch(`${BASE}/run-auto-validation`);
    const data = await res.json();
    if (!data.started && data.error === "already_running") {
      startPolling();
      return;
    }
    setLogs("");
    lastSizeRef.current = 0;
    setIsRunning(true);
    startPolling();
  };

  const clearLogs = () => {
    setLogs("");
    lastSizeRef.current = 0;
  };

  const scrollToBottom = () => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 flex flex-col items-center">
      {/* --- HEADER SECTION --- */}
      <div className="max-w-6xl w-full mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-100">
              <ShieldCheck size={14} /> Audit Protocol v1.2
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              LLM Auto-Validation
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Automated clinical mapping verification powered by Gemini. This engine audits 
              SapBERT generated mappings to ensure semantic integrity and medical alignment.
            </p>
          </div>
          
          {/* Real-time Status Card */}
          <div className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] border transition-all duration-500 shadow-sm ${
            isRunning ? "bg-emerald-50 border-emerald-100 ring-4 ring-emerald-500/10" : "bg-white border-slate-200"
          }`}>
            <div className={`p-3 rounded-2xl ${isRunning ? "bg-emerald-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"}`}>
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Engine Status</p>
              <p className={`text-sm font-bold ${isRunning ? "text-emerald-700" : "text-slate-600"}`}>
                {isRunning ? "VALIDATION IN PROGRESS" : "SYSTEM IDLE"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDE: INFOGRAPHICS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* About Bento Box */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <Cpu className="absolute -right-10 -bottom-10 text-white/10" size={200} />
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} /> Evaluation Logic
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 relative z-10">
              Our pipeline uses contrastive semantic analysis. It cross-references Namaste diacritics with ICD-11's fully specified names and hierarchical paths to determine mapping reliability.
            </p>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
                <span className="block text-[10px] font-black uppercase opacity-60">LLM Core</span>
                <span className="text-xs font-bold font-mono text-indigo-100">Gemini-Flash</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
                <span className="block text-[10px] font-black uppercase opacity-60">Target Accuracy</span>
                <span className="text-xs font-bold font-mono text-indigo-100">98.2%</span>
              </div>
            </div>
          </div>

          {/* How It Works List */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <History size={16} /> Workflow Pipeline
            </h2>
            <ul className="space-y-4">
              {[
                { icon: <Search size={14}/>, text: "Fetch SapBERT mapping records" },
                { icon: <Cpu size={14}/>, text: "Process through Gemini semantic layer" },
                { icon: <ShieldCheck size={14}/>, text: "Evaluate similarity & context" },
                { icon: <AlertCircle size={14}/>, text: "Flag mismatches for human review" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="p-2 bg-slate-50 text-indigo-600 rounded-lg border border-slate-100">
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons Container */}
          <div className="flex flex-col gap-3">
            <button
              onClick={startValidation}
              disabled={isRunning}
              className={`group w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                !isRunning
                  ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Play size={18} className={!isRunning ? "fill-current" : ""} />
              {isRunning ? "Audit in progress" : "Launch Auto-Validation"}
            </button>

            <button
              onClick={clearLogs}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} /> Purge Buffer Logs
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: LOG CONSOLE (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl border border-slate-800 flex flex-col h-full min-h-[600px]">
            {/* Console Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <TerminalIcon size={14} /> validation_stream.sh
                </div>
              </div>
              {isRunning && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-500 font-black uppercase">Active Stream</span>
                </div>
              )}
            </div>

            {/* Console Body */}
            <div 
              ref={logBoxRef}
              className="flex-1 overflow-y-auto p-8 font-mono text-[13px] leading-relaxed custom-scrollbar bg-slate-900/50 rounded-b-[2rem]"
            >
              {logs ? (
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {logs}
                  <span className="animate-pulse bg-emerald-500/50 inline-block w-2 h-4 align-middle ml-1"></span>
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-700">
                  <TerminalIcon size={48} className="mb-4 opacity-20" />
                  <p className="text-xs uppercase font-black tracking-[0.2em] opacity-40">Awaiting validation trigger...</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}