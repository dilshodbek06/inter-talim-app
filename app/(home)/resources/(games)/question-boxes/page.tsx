// "use client";

// import { useState } from "react";
// import { Gift, X, Check } from "lucide-react";

// const GiftBoxQuiz = () => {
//   const [boxes, setBoxes] = useState([
//     { id: 1, opened: false, question: "2 + 2 nechaga teng?" },
//     { id: 2, opened: false, question: "O'zbekistonning poytaxti qayerda?" },
//     { id: 3, opened: false, question: "Bir yilda necha oy bor?" },
//     { id: 4, opened: false, question: "Eng katta okean qaysi?" },
//     { id: 5, opened: false, question: "Quyosh qaysi yulduz turiga kiradi?" },
//     {
//       id: 6,
//       opened: false,
//       question: "Suvning qaynash harorati necha gradus?",
//     },
//     { id: 7, opened: false, question: "Birinchi kosmosga uchgan odam kim?" },
//     {
//       id: 8,
//       opened: false,
//       question: "O'zbekiston mustaqillikka qachon erishgan?",
//     },
//     { id: 9, opened: false, question: "Eng katta sayyora qaysi?" },
//   ]);

//   const [selectedBox, setSelectedBox] = useState(null);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });

//   const handleBoxClick = (box) => {
//     if (!box.opened) {
//       setSelectedBox(box);
//     }
//   };

//   const handleCorrectAnswer = () => {
//     if (selectedBox) {
//       const boxElement = document.getElementById(`box-${selectedBox.id}`);
//       const rect = boxElement.getBoundingClientRect();
//       setConfettiPosition({
//         x: rect.left + rect.width / 2,
//         y: rect.top + rect.height / 2,
//       });

//       setBoxes(
//         boxes.map((b) => (b.id === selectedBox.id ? { ...b, opened: true } : b))
//       );

//       setShowConfetti(true);
//       setTimeout(() => {
//         setShowConfetti(false);
//         setSelectedBox(null);
//       }, 2000);
//     }
//   };

//   const handleWrongAnswer = () => {
//     setSelectedBox(null);
//   };

//   const Confetti = () => {
//     const pieces = Array.from({ length: 50 }, (_, i) => ({
//       id: i,
//       left: Math.random() * 100 - 50,
//       delay: Math.random() * 0.5,
//       duration: 1 + Math.random() * 0.5,
//       color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"][
//         Math.floor(Math.random() * 6)
//       ],
//     }));

//     return (
//       <div
//         className="fixed pointer-events-none z-50"
//         style={{
//           left: `${confettiPosition.x}px`,
//           top: `${confettiPosition.y}px`,
//           transform: "translate(-50%, -50%)",
//         }}
//       >
//         {pieces.map((piece) => (
//           <div
//             key={piece.id}
//             className="absolute w-2 h-2 rounded-full"
//             style={{
//               backgroundColor: piece.color,
//               left: `${piece.left}px`,
//               animation: `confetti-fall ${piece.duration}s ease-out forwards`,
//               animationDelay: `${piece.delay}s`,
//             }}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
//       <style>
//         {`
//           @keyframes confetti-fall {
//             0% {
//               transform: translateY(0) rotate(0deg);
//               opacity: 1;
//             }
//             100% {
//               transform: translateY(300px) rotate(720deg);
//               opacity: 0;
//             }
//           }

//           @keyframes box-shake {
//             0%, 100% { transform: rotate(0deg); }
//             25% { transform: rotate(-5deg); }
//             75% { transform: rotate(5deg); }
//           }

//           .gift-box:hover {
//             animation: box-shake 0.5s ease-in-out;
//           }

//           @keyframes open-box {
//             0% { transform: scale(1); }
//             50% { transform: scale(1.2) rotate(10deg); }
//             100% { transform: scale(1.1); }
//           }

//           .opened-box {
//             animation: open-box 0.5s ease-out;
//           }
//         `}
//       </style>

//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-4 text-purple-800">
//           🎁 Savolli Qutilar O'yini
//         </h1>
//         <p className="text-center text-gray-600 mb-8">
//           Qutini tanlang, savolga javob bering va sovg'ani oching!
//         </p>

//         <div className="grid grid-cols-3 gap-6 mb-8">
//           {boxes.map((box) => (
//             <div
//               key={box.id}
//               id={`box-${box.id}`}
//               onClick={() => handleBoxClick(box)}
//               className={`gift-box cursor-pointer transition-all duration-300 ${
//                 box.opened ? "opened-box" : ""
//               }`}
//             >
//               <div
//                 className={`relative aspect-square rounded-2xl shadow-lg flex items-center justify-center ${
//                   box.opened
//                     ? "bg-gradient-to-br from-green-300 to-green-500"
//                     : "bg-gradient-to-br from-amber-300 to-amber-400"
//                 }`}
//               >
//                 {!box.opened ? (
//                   <>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-full h-4 bg-orange-600 rounded"></div>
//                     </div>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-4 h-full bg-orange-600 rounded"></div>
//                     </div>
//                     <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
//                       <div className="w-16 h-12 bg-orange-600 rounded-t-full"></div>
//                     </div>
//                     <Gift className="w-16 h-16 text-orange-700 z-10" />
//                   </>
//                 ) : (
//                   <div className="text-6xl">✨</div>
//                 )}
//               </div>
//               <p className="text-center mt-2 font-semibold text-gray-700">
//                 {box.opened ? "Ochildi!" : `Quti ${box.id}`}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedBox && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all">
//             <div className="flex justify-between items-start mb-6">
//               <h2 className="text-2xl font-bold text-purple-800">Savol</h2>
//               <button
//                 onClick={() => setSelectedBox(null)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="bg-purple-50 rounded-2xl p-6 mb-8">
//               <p className="text-lg text-gray-800 text-center font-medium">
//                 {selectedBox.question}
//               </p>
//             </div>

//             <p className="text-sm text-gray-600 text-center mb-6">
//               O'quvchi javob berganidan keyin tugmani bosing
//             </p>

//             <div className="flex gap-4">
//               <button
//                 onClick={handleWrongAnswer}
//                 className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
//               >
//                 <X className="w-5 h-5" />
//                 Noto'g'ri
//               </button>
//               <button
//                 onClick={handleCorrectAnswer}
//                 className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
//               >
//                 <Check className="w-5 h-5" />
//                 To'g'ri
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showConfetti && <Confetti />}
//     </div>
//   );
// };

// export default GiftBoxQuiz;

import React from "react";

const Page = () => {
  return <div></div>;
};

export default Page;
