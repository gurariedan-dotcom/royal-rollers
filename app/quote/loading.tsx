export default function QuoteLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16" aria-hidden="true">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-3 h-8 w-72" />
      <div className="skeleton mt-4 h-4 w-56" />

      <div className="mt-10 rounded-sm border border-ink/10 bg-paper p-6 shadow-panel md:p-10">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="skeleton h-8 w-8 shrink-0 rounded-full" />
              {i < 4 && <div className="skeleton h-[2px] flex-1" />}
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <div className="skeleton h-5 w-48" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
