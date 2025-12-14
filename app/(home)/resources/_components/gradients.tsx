"use client";

const Gradients = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-linear-to-br from-sky-400/40 via-indigo-400/40 to-transparent blur-3xl" />

      <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-linear-to-tr from-emerald-300/40 via-sky-300/30 to-transparent blur-3xl" />

      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-t from-violet-300/30 via-sky-200/20 to-transparent blur-3xl opacity-70" />
    </div>
  );
};

export default Gradients;
