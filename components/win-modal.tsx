import { Trophy, X } from "lucide-react";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  score?: number;
  message?: string;
  results?: { label: string; score: number; className?: string }[];
}

export const WinModal = ({
  isOpen,
  onClose,
  score,
  message = "Ajoyib qatnashuv!",
  results,
}: WinModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPopIn {
          0% {
            transform: scale(0.5) translateY(2rem);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes trophy-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes star-burst {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        @keyframes bounce-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5rem); }
        }
        
        .modal-backdrop {
          animation: backdropFadeIn 0.3s ease-out;
        }
        
        .modal-content {
          animation: modalPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .trophy-icon {
          animation: trophy-wiggle 0.8s ease-in-out 0.3s, 
                    trophy-wiggle 0.8s ease-in-out 3s infinite 2.5s;
        }
        
        .icon-bounce {
          animation: bounce-up 0.8s ease-in-out;
        }
        
        .icon-bounce-1 { animation-delay: 0.7s; }
        .icon-bounce-2 { animation-delay: 0.9s; }
        .icon-bounce-3 { animation-delay: 1.1s; }
        
        .score-pop {
          animation: modalPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s backwards;
        }
        
        .dots-bounce {
          animation: bounce-up 0.8s ease-in-out;
        }
        
        .dot-0 { animation-delay: 0.7s; }
        .dot-1 { animation-delay: 0.8s; }
        .dot-2 { animation-delay: 0.9s; }
        .dot-3 { animation-delay: 1s; }
        .dot-4 { animation-delay: 1.1s; }
      `}</style>

      <div
        className="fixed inset-0 bg-linear-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-3xl sm:rounded-4xl shadow-2xl max-w-sm sm:max-w-lg w-full overflow-hidden modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50 to-pink-50" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-linear-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-48 sm:h-48 bg-linear-to-tl from-pink-300/30 to-purple-300/30 rounded-full blur-3xl" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 p-2 rounded-full bg-white/90 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative px-5 sm:px-8 py-7 sm:py-12 flex flex-col items-center">
            <div className="relative mb-5 sm:mb-8">
              <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 scale-110" />
              <div className="relative bg-linear-to-br from-yellow-400 via-orange-400 to-pink-500 p-6 sm:p-8 rounded-full shadow-2xl trophy-icon">
                <Trophy
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 text-white drop-shadow-lg"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div
              style={{ animation: "modalPopIn 0.5s ease-out 0.4s backwards" }}
            >
              <div className="text-center space-y-3 mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
                  {message}
                </h2>
              </div>
            </div>
            {results && results.length > 0 ? (
              <div className="score-pop relative mb-5 sm:mb-8 w-full max-w-md">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur-md opacity-40" />
                <div className="relative rounded-3xl bg-white/90 p-3 sm:p-4 shadow-2xl">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {results.map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-2xl px-4 py-3 sm:py-4 text-white shadow-lg ${
                          item.className ??
                          "bg-linear-to-br from-slate-600 to-slate-800"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                          {item.score}
                        </p>
                        <span className="text-[11px] font-semibold uppercase opacity-90">
                          ball
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : score !== undefined ? (
              <div className="score-pop relative mb-8">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur-md opacity-60" />
                <div className="relative bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 px-7 py-4 sm:px-9 sm:py-5 md:px-12 md:py-6 rounded-3xl shadow-2xl">
                  <p className="text-white text-center">
                    <span className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg">
                      {score}
                    </span>
                    <span className="block text-sm font-bold mt-2 opacity-95 tracking-wide uppercase">
                      ball
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
