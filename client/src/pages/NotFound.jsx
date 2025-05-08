import React, { useEffect, useState } from "react";
import { Home, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";

const Notfound = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800">
      {/* Geometric decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 opacity-10 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-tr-full"></div>

      {/* Content container with glass effect */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-12 mx-auto text-center">
        {/* Main content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Glowing 404 header */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 flex items-center justify-center mb-6 blur-2xl opacity-50">
              <span className="text-9xl font-extrabold text-purple-500">
                404
              </span>
            </div>
            <div className="flex items-center justify-center mb-6 relative">
              <span className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                404
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h1>

            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
            </div>

            <p className="text-purple-200 max-w-md mx-auto">
              The digital path you're seeking seems to have vanished into the
              void.
            </p>
          </div>

          {/* Action buttons with hover effects */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-center gap-5">
              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 group"
              >
                <Home size={18} className="group-hover:animate-bounce" />
                <span>Go Home</span>
              </a>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center cursor-pointer gap-2 bg-white/10 backdrop-blur-sm border border-purple-300/30 hover:bg-white/20 text-white rounded-xl px-6 py-3.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1 group"
              >
                <RefreshCw size={18} className="group-hover:animate-spin" />
                <span>Try Again</span>
              </button>

              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center cursor-pointer gap-2 bg-white/10 backdrop-blur-sm border border-purple-300/30 hover:bg-white/20 text-white rounded-xl px-6 py-3.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1 group"
              >
                <ArrowLeft size={18} className="group-hover:animate-pulse" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-purple-200 text-sm">
          <p>© {new Date().getFullYear()}. All rights reserved.</p>
          <p className="mt-2 text-purple-300/70">
            Beautifully lost in the digital universe
          </p>
        </div>
      </div>

      {/* CSS for cursor trail effect */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px) scale(1.05);
          }
        }

        .cursor-trail {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(192, 132, 252, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          animation: fadeOut 1.5s forwards;
        }

        @keyframes fadeOut {
          0% {
            opacity: 0.7;
            width: 8px;
            height: 8px;
          }
          100% {
            opacity: 0;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default Notfound;
