import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { motion } from "motion/react";
import { GraduationCap, Home, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let title = "Oops! Something went wrong";
  let message = "We encountered an unexpected error while processing your request.";
  let code = "Unexpected Error";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The university page or resource you're looking for doesn't exist or has been moved.";
      code = "404";
    } else if (error.status === 401) {
      title = "Unauthorized Access";
      message = "You don't have permission to view this page. Please login with correct credentials.";
      code = "401";
    } else if (error.status === 503) {
      title = "Service Unavailable";
      message = "The admission server is currently overloaded. Please try again later.";
      code = "503";
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        {/* Decorative Circle */}
        <div className="relative mb-8 mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#D4A857]/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-white border-2 border-[#D4A857]/20 rounded-3xl flex items-center justify-center shadow-xl shadow-[#D4A857]/10 rotate-3 group hover:rotate-0 transition-transform">
            {code === "404" ? (
              <AlertCircle className="w-12 h-12 text-[#D4A857]" />
            ) : (
              <GraduationCap className="w-12 h-12 text-[#D4A857]" />
            )}
          </div>
        </div>

        <span className="inline-block px-4 py-1.5 bg-[#D4A857]/15 text-[#C8860A] text-sm font-bold rounded-full mb-4 uppercase tracking-widest leading-none">
          Error {code}
        </span>
        
        <h1 className="text-[#1A0A02] mb-4" style={{ fontSize: "2.5rem", fontWeight: 800 }}>
          {title}
        </h1>
        
        <p className="text-[#6B3A1F]/70 text-lg mb-10 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1A0A02] text-[#D4A857] rounded-2xl font-bold hover:shadow-xl hover:shadow-[#1A0A02]/20 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#D4A857]/30 text-[#C8860A] rounded-2xl font-bold hover:border-[#D4A857] active:scale-95 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-[#D4A857]/10">
          <p className="text-[#6B3A1F]/40 text-sm">
            Need help? <Link to="/contact" className="text-[#C8860A] hover:underline font-bold">Contact Admission Support</Link>
          </p>
        </div>
      </motion.div>

      {/* Background Decorative Patterns */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4A857]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C8860A]/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
