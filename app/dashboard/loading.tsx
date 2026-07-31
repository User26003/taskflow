export default function DashboardLoading() {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="mt-3 h-10 w-80 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-[28rem] rounded bg-slate-200" />
          </div>
  
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
              </div>
            ))}
          </div>
  
          <div className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="mt-6 space-y-4">
                <div className="h-10 rounded bg-slate-200" />
                <div className="h-28 rounded bg-slate-200" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-10 rounded bg-slate-200" />
                  <div className="h-10 rounded bg-slate-200" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-10 rounded bg-slate-200" />
                  <div className="h-10 rounded bg-slate-200" />
                </div>
                <div className="h-10 w-40 rounded bg-slate-200" />
              </div>
            </div>
  
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-6 w-32 rounded bg-slate-200" />
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="h-10 rounded bg-slate-200" />
                  <div className="h-10 rounded bg-slate-200" />
                  <div className="h-10 rounded bg-slate-200" />
                  <div className="h-10 rounded bg-slate-200" />
                </div>
              </div>
  
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-4 h-16 rounded bg-slate-200" />
                    <div className="mt-5 h-10 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }