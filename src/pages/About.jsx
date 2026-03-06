import React from "react";
import { 
  BookOpen, 
  Globe, 
  Zap, 
  ShieldAlert, 
  HeartPulse, 
  Workflow, 
  Binary, 
  Activity,
  ArrowRight
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-24">

        {/* --- HERO SECTION --- */}
        <header className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 mb-2">
            <HeartPulse size={14} /> Clinical Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Bridging Traditional Wisdom <br/>
            <span className="text-indigo-600">with Global Standards</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            The NAMASTE–ICD Mapping Dashboard is a professional-grade workspace designed to unify 
            indigenous medical terminologies with the WHO’s ICD-11 framework using Neural NLP and LLM validation.
          </p>
        </header>

        {/* --- DUAL CORE TERMINOLOGY (Bento Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Namaste Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform">
              <Binary size={120} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                <DatabaseIcon />
              </div>
              NAMASTE Registry
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed relative z-10">
              <p>
                <strong>National AYUSH Morbidity and Standardised Terminologies Electronic</strong> is India’s official clinical concept system for Ayurveda, Unani, and Siddha.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {["Unique Codes", "Sanskrit IAST", "Clinical Definitions", "Disciplines"].map(item => (
                  <div key={item} className="flex items-center gap-2 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* ICD-11 Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600 group-hover:scale-110 transition-transform">
              <Globe size={120} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
                <Globe size={24} />
              </div>
              WHO ICD-11 TM2
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed relative z-10">
              <p>
                The <strong>Traditional Medicine Chapter (TM2)</strong> is the global standard for symptoms and diagnostic patterns used in traditional medicine worldwide.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {["Specified Names", "Hierarchy Paths", "Index Terms", "Global Context"].map(item => (
                  <div key={item} className="flex items-center gap-2 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- WHY IT MATTERS (Timeline/Flow style) --- */}
        <section className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[100px]" />
          </div>
          <h2 className="text-3xl font-black mb-12 text-center tracking-tight">The Value of Interoperability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
             {[
               { icon: <Workflow />, title: "Standardization", desc: "Align AYUSH records across diverse EHR systems instantly." },
               { icon: <Zap />, title: "Research-Ready", desc: "Integrate traditional medicine into global health frameworks." },
               { icon: <Activity />, title: "Neural Accuracy", desc: "Leverage SapBERT and LLMs to solve terminological ambiguity." }
             ].map((feature, i) => (
               <div key={i} className="space-y-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-bold">{feature.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* --- SYSTEM CAPABILITIES (Modern Grid) --- */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Unified Tooling Ecosystem</h2>
            <p className="text-slate-500 font-medium mt-2">Everything required for medical knowledge alignment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureBox title="Search Engine" desc="Optimized fuzzy matching with diacritic normalization." />
            <FeatureBox title="LLM Validation" desc="Gemini-Flash 2.5 semantic reasoning for mapping audit." />
            <FeatureBox title="SapBERT Training" desc="Neural embedding fine-tuning for domain specific accuracy." />
            <FeatureBox title="Review Pipeline" desc="Interactive workflows to approve or reject suggested mappings." />
            <FeatureBox title="Dataset Explorer" desc="Deep-dive into paths, index terms, and medical context." />
            <FeatureBox title="AYU-TERM API" desc="Direct access to WHO Ayurvedic Terminology datasets." />
          </div>
        </div>

        {/* --- DISCLAIMER --- */}
        <section className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
           <div className="p-4 bg-red-100 text-red-600 rounded-3xl shadow-sm">
             <ShieldAlert size={32} />
           </div>
           <div>
             <h2 className="text-xl font-black text-red-900 uppercase tracking-tighter mb-2">Clinical Integrity Notice</h2>
             <p className="text-red-700/80 text-sm leading-relaxed max-w-3xl font-medium">
               This platform is a research implementation. Mapping outputs are model-generated and may 
               require expert human verification. Clinical usage should always be governed by 
               qualified medical practitioners and WHO-certified guidelines.
             </p>
           </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="text-center py-12 border-t border-slate-200">
           <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
             © {new Date().getFullYear()} NAMASTE–ICD Systems Group • All Rights Reserved
           </p>
        </footer>

      </div>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function FeatureBox({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight size={14} className="text-indigo-600" />
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function DatabaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  );
}