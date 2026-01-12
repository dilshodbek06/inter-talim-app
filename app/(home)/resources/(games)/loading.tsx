const Loading = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 px-4 py-10 text-slate-900">
      <div className="pointer-events-none absolute -top-20 -left-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl animate-float-slow" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-linear-to-tr from-sky-400 via-indigo-500 to-violet-500 p-0.5 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90">
                  <div className="h-6 w-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Yuklanmoqda
                </p>
                <h1 className="text-2xl font-bold text-slate-900">
                  O‘yin sahifasi tayyorlanmoqda
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>bir lahza</span>
              <div className="flex items-center gap-1">
                <span className="loading-dot h-2 w-2 rounded-full bg-sky-400" />
                <span className="loading-dot h-2 w-2 rounded-full bg-indigo-400" />
                <span className="loading-dot h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Interaktiv kontentlar, savollar va dizaynlar yuklanmoqda.
          </p>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div className="loading-bar h-full w-1/2 rounded-full bg-linear-to-r from-sky-400 via-indigo-500 to-emerald-400" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <span className="h-3 w-3 rounded-full bg-sky-500" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Modul
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    Savollar
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <span className="h-3 w-3 rounded-full bg-indigo-500" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Grafika
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    Interfeys
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Natija
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    Hisobot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-60%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes dot-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        .loading-bar {
          animation: loading-bar 1.4s ease-in-out infinite;
        }

        .loading-dot {
          animation: dot-bounce 1s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
