import { useEffect, useState, useRef } from "react";
export default function AutoValidation() {
  const [logs, setLogs] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const pollingRef = useRef(null);
  const lastSizeRef = useRef(0);
  const logBoxRef = useRef(null);

  const BASE = "https://automated-training-mapping-pipeline.up.railway.app/";

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
    <>
    <div className="min-h-screen bg-gray-100  p-8 flex items-center justify-center">
      <div className="w-full h-full  bg-white rounded-2xl shadow-xl p-8 space-y-8 ">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Auto Validation</h1>
          <p className="text-gray-600">
            Automatically validate Namaste–ICD mappings using an LLM-powered
            microservice. This improves consistency, flags mismatches, and
            assists the human review process.
          </p>
        </div>
        <div className="sm:flex sm:flex-col sm:gap-2">
        <div className="sm:flex sm:gap-2 sm:w-full">
          {/* Dummy Info Section */}
          <div className="bg-gray-50 rounded-xl p-5 border space-y-2 sm:w-1/2">
            <h2 className="text-lg font-semibold">About Auto Validation</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              This module uses an LLM (Gemini-2.5-Flash) to automatically check
              mapping accuracy. It compares Namaste terms with ICD semantic
              representations, checks terminology alignment, and identifies
              potential mismatches for human review.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-gray-50 rounded-xl p-5 border space-y-3 sm:w-1/2">
            <h2 className="text-lg font-semibold">
              How the Validation Pipeline Works
            </h2>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              <li>Fetches each mapping record from SapBert generated mapping data.</li>
              <li>Processes the Namaste term + ICD code through Gemini 2.5.</li>
              <li>
                LLM evaluates semantic similarity and context correctness.
              </li>
              <li>Flags mappings as valid, questionable, or mismatched.</li>
              <li>Appends detailed evaluation logs live in real time.</li>
              <li>
                Results are used to improve dataset quality and training data.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* Status */}
          <div
            className={`w-full p-3 rounded-lg text-sm font-medium ${
              isRunning
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}
          >
            {isRunning
              ? "Auto Validation is currently running…"
              : "System is idle."}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={startValidation}
              disabled={isRunning}
              className={` px-5 py-3 rounded-lg text-white font-medium ${
                isRunning ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRunning ? "Running…" : "Start Auto Validation"}
            </button>

            <button
              onClick={clearLogs}
              className="px-5 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Clear Logs
            </button>
          </div>

          {/* Logs */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Validation Logs</h2>
            <div
              ref={logBoxRef}
              className="bg-black text-green-400 font-mono text-sm p-4 h-96 overflow-y-auto rounded-lg whitespace-pre-wrap"
            >
              {logs || "Logs will appear here..."}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
