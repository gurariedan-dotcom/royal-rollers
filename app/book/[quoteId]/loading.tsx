export default function BookLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16" aria-hidden="true">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-3 h-8 w-72" />
      <div className="skeleton mt-4 h-4 w-full max-w-md" />

      <div className="mt-10 rounded-sm border border-ink/10 bg-paper p-6 shadow-panel md:p-10">
        <div className="skeleton h-24 w-full" />
        <div className="skeleton mt-6 h-12 w-full" />
      </div>
    </div>
  );
}
