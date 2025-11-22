import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-linear-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  duration: 0.6,
                  bounce: 0.5,
                },
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                y: -50,
                transition: { duration: 0.3 },
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-4xl shadow-2xl max-w-lg w-full overflow-hidden"
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
                  <motion.div
                    animate={{
                      rotate: [0, -8, 8, -8, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 scale-110" />
                    <div className="relative bg-linear-to-br from-yellow-400 via-orange-400 to-pink-500 p-8 rounded-full shadow-2xl">
                      <Trophy
                        className="w-10 h-10 md:w-20 md:h-20 text-white drop-shadow-lg"
                        strokeWidth={2.5}
                      />
                    </div>
                  </motion.div>

                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.cos((i * 45 * Math.PI) / 180) * 100],
                        y: [0, Math.sin((i * 45 * Math.PI) / 180) * 100],
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.5 + i * 0.08,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          i % 2 === 0 ? "text-yellow-400" : "text-orange-400"
                        } fill-current drop-shadow-md`}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-6 mb-6">
                  <motion.div
                    animate={{ rotate: [0, -15, 15, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: 0.8,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                    }}
                  >
                    <PartyPopper
                      className="w-8 h-8 md:w-10 md:h-10 text-pink-500 drop-shadow-md"
                      strokeWidth={2}
                    />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 1,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                    }}
                  >
                    <Award
                      className="w-8 h-8 md:w-10 md:h-10 text-blue-500 drop-shadow-md"
                      strokeWidth={2}
                    />
                  </motion.div>
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity },
                    }}
                  >
                    <Sparkles
                      className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 drop-shadow-md"
                      strokeWidth={2}
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center space-y-3 mb-8"
                >
                  <h2 className="text-[35px] md:text-5xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
                    {message}
                  </h2>
                </motion.div>
                {score !== undefined && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.6,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="relative mb-8"
                  >
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
                  </motion.div>
                )}
                <div className="flex gap-3 mb-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -25, 0],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.7 + i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1.8,
                      }}
                      className={`w-3 h-3 rounded-full shadow-lg ${
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
