import Link from "next/link";
import { ArrowRight, ShieldCheck, FileSearch, BrainCircuit, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeroContent } from "@/components/home/hero-content";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200">
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">MediVault</span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-full px-6">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium text-slate-600 hover:text-slate-900">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <HeroContent isAuthed={!!session} />

      {/* Features Section */}
      <section className="bg-white py-24 pb-32 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Secure Storage</h3>
              <p className="text-slate-600 leading-relaxed">
                Your medical records belong to you. We keep them securely stored and completely private, accessible only through your authenticated vault.
              </p>
            </div>
            
            <div className="space-y-4">
               <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100/50">
                <FileSearch className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Instant Search</h3>
              <p className="text-slate-600 leading-relaxed">
                Never lose a prescription again. Easily find any test report, scan, or notes by searching titles, categories, or doctor names instantly.
              </p>
            </div>
            
            <div className="space-y-4">
               <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100/50">
                <BrainCircuit className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Summaries</h3>
              <p className="text-slate-600 leading-relaxed">
                Medical jargon made simple. Our integrated AI reads your uploaded reports and generates brief, simple summaries you can actually understand.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-100 bg-white">
        © {new Date().getFullYear()} MediVault. Designed for the Advanced Agentic Coding Project.
      </footer>
    </div>
  );
}
