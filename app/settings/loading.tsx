export default function SettingsLoading() {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="mb-8">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="mt-3 h-10 w-64 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
          </div>
  
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <div className="mb-2 h-4 w-16 rounded bg-slate-200" />
                <div className="h-10 rounded bg-slate-200" />
              </div>
              <div>
                <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
                <div className="h-10 rounded bg-slate-200" />
              </div>
              <div>
                <div className="mb-2 h-4 w-28 rounded bg-slate-200" />
                <div className="h-10 rounded bg-slate-200" />
              </div>
              <div className="h-10 w-36 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }