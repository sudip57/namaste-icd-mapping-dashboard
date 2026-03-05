import React from "react";
import TranslationCard from "../components/TranslationCard";
import { 
  Database, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Binary, 
  Info, 
  ArrowUpRight, 
  FileCheck
} from "lucide-react";

const Map = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      
      {/* --- HERO SECTION --- */}
      <div className="w-full bg-slate-900 pt-20 pb-32 px-6 text-center text-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Namaste<span className="text-indigo-500">–</span>ICD <br/> 
            <span className="text-slate-400">Unified Mapping</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A high-performance bridge between <span className="text-white border-b border-indigo-500">Traditional Medicine</span> and global <span className="text-white border-b border-blue-500">ICD-11 TM2</span> standards.
          </p>
        </div>
      </div>

      {/* --- FLOATING SEARCH SECTION --- */}
      <div className="max-w-5xl w-full px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 p-2">
           <TranslationCard />
        </div>
      </div>

      {/* --- MAIN BENTO GRID --- */}
      <div className="max-w-6xl w-full px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Core Stats / About Card (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                <Database className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Terminology Alignment</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              Namaste-ICD leverages <span className="text-indigo-600 font-bold underline decoration-2">SapBERT semantic modeling</span> to normalize historically ambiguous indigenous medical terms into interoperable global datasets.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Interoperable EMR/EHR", 
                "Multilingual Search", 
                "NLP Encoding", 
                "Clinical Research"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Records</span>
               <span className="text-3xl font-black text-slate-900">~980 <span className="text-lg text-slate-400 italic">pts</span></span>
             </div>
             <FileCheck size={40} className="text-slate-200" />
          </div>
        </div>

        {/* How It Works Stack (5 Cols) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex-1 border border-slate-800 shadow-xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Cpu size={20} className="text-indigo-400" /> 
               System Pipeline
             </h2>
             <ul className="space-y-5">
                {[
                  { icon: "🔍", title: "Fuzzy Engine", desc: "Diacritic normalization" },
                  { icon: "🤖", title: "LLM Validate", desc: "Gemini-driven audit" },
                  { icon: "🧬", title: "SapBERT", desc: "Contrastive learning" },
                  { icon: "📊", title: "Explorer UI", desc: "Human-in-the-loop" }
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 group cursor-default">
                    <span className="text-xl">{step.icon}</span>
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                      <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Technical Guidelines (Full Width 12 Cols) */}
        <div className="md:col-span-12 bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Binary size={120} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-8">Training & Data Architecture</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-indigo-600 font-bold text-sm">01</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong className="text-slate-900 italic">Volume Requirement:</strong> SapBERT requires at least <span className="font-bold text-indigo-600">300–500 POS/NEG pairs</span> to stabilize embeddings. Small batches cause drift.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-indigo-600 font-bold text-sm">02</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong className="text-slate-900 italic">Engine Dependency:</strong> The validation logic automatically pulls the latest <code className="bg-slate-100 px-1 rounded font-bold">.pth</code> embedding weights generated from the last GPU run.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Binary size={14} /> Training Payload Schema
               </h4>
               <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-indigo-600">text1</span>
                    <span className="text-slate-500">Namaste Term + Desc</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-indigo-600">text2</span>
                    <span className="text-slate-500">ICD Path + Hierarchy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-600">label</span>
                    <span className="font-bold text-slate-900">1 (Valid) / 0 (Null)</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Card (12 Cols) */}
        <div className="md:col-span-12 bg-red-50 border border-red-100 rounded-[2rem] p-8 flex items-center gap-6">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl hidden md:block">
            <ShieldAlert size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-red-900 mb-1 uppercase tracking-tight">Clinical Integrity Notice</h2>
            <p className="text-red-700/80 text-sm leading-relaxed">
              Mappings are model-generated for research demonstration. This platform <strong>does not replace medical expertise</strong>. Always verify results with a qualified clinical coder or practitioner.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-slate-200 py-10 text-center flex flex-col items-center gap-4">
        <div className="flex gap-6 text-slate-400">
           <a href="#" className="hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">Documentation</a>
           <a href="#" className="hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">API Docs</a>
           <a href="#" className="hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">GitHub</a>
        </div>
        <p className="text-slate-400 text-xs font-medium italic">
          © {new Date().getFullYear()} Namaste–ICD Research Group. Built for Medical NLP Innovation.
        </p>
      </footer>
    </div>
  );
};

export default Map;