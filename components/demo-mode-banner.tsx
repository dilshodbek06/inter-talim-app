import { Megaphone } from "lucide-react";

export default function DemoModeBanner() {
  return (
    <div className="w-full overflow-hidden bg-yellow-400 text-black py-2 shadow-md border-b border-yellow-500">
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        .scroll-banner {
          animation: scroll-left 18s linear infinite;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          font-size: 0.875rem;
          font-weight: 500;
          will-change: transform;
        }
      `}</style>
      <div className="scroll-banner">
        <Megaphone className="h-4 w-4" />
        Platforma hozirda test rejimida ishlayapdi.
      </div>
    </div>
  );
}
