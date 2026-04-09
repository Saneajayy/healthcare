"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileSearch, BrainCircuit } from "lucide-react";

const features = [
  {
    title: "Secure Storage",
    description: "Your medical records belong to you. We keep them securely stored and completely private, accessible only through your authenticated vault.",
    icon: ShieldCheck,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    delay: 0.1
  },
  {
    title: "Instant Search",
    description: "Never lose a prescription again. Easily find any test report, scan, or notes by searching titles, categories, or doctor names instantly.",
    icon: FileSearch,
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    delay: 0.2
  },
  {
    title: "AI Summaries",
    description: "Medical jargon made simple. Our integrated AI reads your uploaded reports and generates brief, simple summaries you can actually understand.",
    icon: BrainCircuit,
    color: "from-sky-400 to-cyan-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
    delay: 0.3
  }
];

export function FeaturesSection() {
  return (
    <section className="relative bg-white py-32 px-6 border-t border-slate-100 overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need for your health.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            A secure, intelligent platform built purely for managing your medical journey effortlessly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300"
            >
              {/* Top gradient blur */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-full blur-2xl -mt-10 -mr-10 transition-opacity group-hover:opacity-10`}></div>
              
              <div className="space-y-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-slate-800 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-110" />
                  <feature.icon className="h-8 w-8 text-blue-600 group-hover:opacity-0 transition-opacity duration-300" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
