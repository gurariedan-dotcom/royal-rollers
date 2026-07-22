export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16" aria-hidden="true">
      <div className="skeleton h-3 w-32" />
      <div className="skeleton mt-3 h-10 w-80 max-w-full" />
      <div className="skeleton mt-4 h-4 w-64 max-w-full" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="skeleton h-40 w-full" />
        <div className="skeleton h-40 w-full" />
      </div>
    </div>
  );
}
