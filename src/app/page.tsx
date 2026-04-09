import Link from "next/link";
import { ArrowRight, ShieldCheck, FileSearch, BrainCircuit, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200">
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">MediVault</span>
          </div>
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

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-800 mb-8 shadow-sm">
          <BrainCircuit className="w-4 h-4 mr-2" />
          Powered by Gemini AI Summaries
        </div>
        
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
          Your health journey, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            beautifully organized.
          </span>
        </h1>
        
        <p className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed font-light">
          Securely upload, organize, and understand your medical records. MediVault transforms your scattered documents into a crystal-clear timeline of your health.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {session ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 w-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 rounded-full text-lg">
                Enter Your Vault <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 w-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 rounded-full text-lg">
                  Start Your Vault <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-8 w-full border-slate-200 text-slate-700 hover:bg-slate-100 rounded-full text-lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>

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
