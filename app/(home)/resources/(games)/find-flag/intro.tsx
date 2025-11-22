import { useState } from "react";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import BackPrev from "@/components/back-prev";

interface IntroProps {
  onStart: (playerName: string) => void;
}

export const Intro = ({ onStart }: IntroProps) => {
  const [playerName, setPlayerName] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setErrors("Ism kiriting");
      return;
    }

    if (playerName.trim().length < 2) {
      setErrors("Ism kamida 2 ta belgidan iborat bo‘lishi kerak");
      return;
    }

    onStart(playerName.trim());
  };

  const steps = [
    {
      number: 1,
      title: "Bayroqni ko‘rish",
      description: "Ekraningizda biror davlat bayrog‘i paydo bo‘ladi",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      number: 2,
      title: "Davlatni tanlash",
      description: "Bayroq ostidagi 4 variantdan to‘g‘ri davlatni tanlang",
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      number: 3,
      title: "Vaqt bilan bellashish",
      description: "Har bir savolga javob berish uchun 10 soniya vaqtingiz bor",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      number: 4,
      title: "Ball to‘plash",
      description: "Har bir to‘g‘ri javob uchun 1 ball oling",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      number: 5,
      title: "O‘yin 6 ta xatogacha davom etadi",
      description: "20 ta savolli raundlar bilan o‘zingizni sinab ko‘ring",
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 flex items-center justify-center py-2 px-2">
      <div className="max-w-6xl w-full">
        <BackPrev />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT SIDE - INTRO */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 p-3 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                O‘yin qoidalari
              </h2>
            </div>

            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4 items-start">
                  <div
                    className={`shrink-0 w-10 h-10 ${step.bg} rounded-full flex items-center justify-center mt-1`}
                  >
                    <span className={`font-bold ${step.text}`}>
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-semibold"></span> Dunyo bo‘ylab
                bayroqlarni o‘rganib, o‘yin orqali bilimlarni oshiring!
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - PLAYER FORM */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              O‘yin boshlashga tayyormisiz?{" "}
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </h2>
            <p className="text-gray-600 mb-6">
              O‘yinni boshlash uchun ism kiriting
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="playerName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  O‘yinchi ismi
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setErrors("");
                  }}
                  placeholder="Ism kiriting..."
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${
                    errors
                      ? "border-rose-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors && (
                  <p className="text-rose-500 text-sm mt-1">{errors}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-edu-blue text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                O‘yinni boshlash <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <span className="text-sm">Geografiya bilimlarini oshiring</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <span className="text-sm">
                  Tezkor reflekslarni sinab ko‘ring
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
                <span className="text-sm">O‘zingizni sinab ko‘ring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
