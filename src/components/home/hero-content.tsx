"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BrainCircuit, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroContentProps {
  isAuthed: boolean;
}

export function HeroContent({ isAuthed }: HeroContentProps) {
  return (
    <main className="relative flex-1 flex items-center justify-center pt-32 pb-32 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-sky-50"></div>
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-sky-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 transform translate-x-1/3"></div>
      <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50"></div>
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="text-left z-10 flex flex-col items-start space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-blue-800 shadow-sm"
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            Powered by Gemini AI Summaries
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            Your health journey, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 pb-2 inline-block">
              beautifully organized.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-xl text-slate-600 leading-relaxed font-light"
          >
            Securely upload, organize, and understand your medical records. MediVault transforms your scattered documents into a crystal-clear timeline of your health.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
          >
            {isAuthed ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 w-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 rounded-full text-lg font-medium transition-all hover:scale-105">
                  Enter Your Vault <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 px-8 w-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 rounded-full text-lg font-medium transition-all hover:scale-105">
                    Start Your Vault <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-14 px-8 w-full border-slate-200/60 bg-white/50 backdrop-blur-md text-slate-700 hover:bg-white/80 rounded-full text-lg font-medium transition-all hover:scale-105">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Right Content - Abstract Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="relative z-10 hidden lg:block"
        >
          <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/50 bg-white/10 backdrop-blur-xl">
            <Image 
              src="/hero.png" 
              alt="MediVault Abstract Concept" 
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            {/* Luminous overlay for glass effect */}
            <div className="absolute inset-0 border-[2px] border-white/40 rounded-[3rem] pointer-events-none z-20"></div>
          </div>
          
          {/* Floating decorative elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-10 -left-10 w-24 h-24 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl flex items-center justify-center z-30"
          >
            <ShieldCheck className="w-10 h-10 text-blue-500" />
          </motion.div>
          <motion.div 
             animate={{ y: [0, 20, 0] }} 
             transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -right-8 w-28 h-28 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-lg flex items-center justify-center z-30"
          >
            <Activity className="w-12 h-12 text-indigo-500" />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
