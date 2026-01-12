const Loading = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-emerald-50 px-4 py-10 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-linear-to-tr from-sky-400 via-indigo-500 to-violet-500 p-0.5 shadow-md">
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
                <p className="mt-2 text-sm text-slate-600">
                  Interaktiv kontentlar yuklanmoqda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
