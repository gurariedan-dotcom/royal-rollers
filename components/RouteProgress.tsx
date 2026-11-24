// Step tracker for the quote form, per the redesign mockup: numbered
// circles, amber when done, navy for the current step, gray when upcoming.
type RouteProgressProps = {
  steps: string[];
  currentIndex: number;
};

export default function RouteProgress({ steps, currentIndex }: RouteProgressProps) {
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Quote request progress">
      {steps.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li
            key={step}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 sm:h-10 sm:w-10",
                isComplete
                  ? "bg-amber text-navy"
                  : isCurrent
                  ? "bg-navy text-ink"
                  : "bg-paper-dim text-slate",
              ].join(" ")}
            >
              {i + 1}
              {isComplete && <span className="sr-only"> (done)</span>}
            </span>
            <span
              className={[
                "text-xs sm:text-sm",
                isCurrent ? "font-bold text-ink" : "hidden text-slate sm:block",
              ].join(" ")}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
