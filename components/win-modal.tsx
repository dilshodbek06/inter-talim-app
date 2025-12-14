import { Trophy, Star, Sparkles, X, Award, PartyPopper } from "lucide-react";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  score?: number;
  message?: string;
}

export const WinModal = ({
  isOpen,
  onClose,
  score,
  message = "Ajoyib qatnashuv!",
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
        className="fixed inset-0 bg-linear-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 modal-backdrop"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-4xl shadow-2xl max-w-lg w-full overflow-hidden modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50 to-pink-50" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-linear-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-linear-to-tl from-pink-300/30 to-purple-300/30 rounded-full blur-3xl" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative px-8 py-12 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 scale-110" />
              <div className="relative bg-linear-to-br from-yellow-400 via-orange-400 to-pink-500 p-8 rounded-full shadow-2xl trophy-icon">
                <Trophy
                  className="w-10 h-10 md:w-20 md:h-20 text-white drop-shadow-lg"
                  strokeWidth={2.5}
                />
              </div>

              {[...Array(8)].map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      animation: `bounce-up 0.6s ease-out ${
                        0.5 + i * 0.08
                      }s backwards`,
                    }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i % 2 === 0 ? "text-yellow-400" : "text-orange-400"
                      } fill-current drop-shadow-md`}
                      style={{
                        transform: `translate(${Math.cos(angle) * 60}px, ${
                          Math.sin(angle) * 60
                        }px)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mb-6">
              <div className="icon-bounce icon-bounce-1">
                <PartyPopper className="w-8 h-8 md:w-10 md:h-10 text-pink-500 drop-shadow-md" />
              </div>
              <div className="icon-bounce icon-bounce-2">
                <Award className="w-8 h-8 md:w-10 md:h-10 text-blue-500 drop-shadow-md" />
              </div>
              <div className="icon-bounce icon-bounce-3">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 drop-shadow-md" />
              </div>
            </div>
            <div
              style={{ animation: "modalPopIn 0.5s ease-out 0.4s backwards" }}
            >
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-[35px] md:text-5xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
                  {message}
                </h2>
              </div>
            </div>
            {score !== undefined && (
              <div className="score-pop relative mb-8">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur-md opacity-60" />
                <div className="relative bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 px-9 py-5 md:px-12 md:py-6 rounded-3xl shadow-2xl">
                  <p className="text-white text-center">
                    <span className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg">
                      {score}
                    </span>
                    <span className="block text-sm font-bold mt-2 opacity-95 tracking-wide uppercase">
                      ball
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full shadow-lg dots-bounce dot-${i} ${
                    i === 0
                      ? "bg-blue-500"
                      : i === 1
                      ? "bg-purple-500"
                      : i === 2
                      ? "bg-pink-500"
                      : i === 3
                      ? "bg-orange-500"
                      : "bg-yellow-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
