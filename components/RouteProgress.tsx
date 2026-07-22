// Step tracker for the quote form. Deliberately not a generic "1 2 3 4"
// circle row -- each step is a literal stop on the request, reusing the
// same dashed route-rule line language as the homepage's TransportScene.
type RouteProgressProps = {
  steps: string[];
  currentIndex: number;
};

export default function RouteProgress({ steps, currentIndex }: RouteProgressProps) {
  return (
    <ol className="flex w-full items-center" aria-label="Quote request progress">
      {steps.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs transition-colors duration-300",
                  isComplete
                    ? "border-highway bg-highway text-paper"
                    : isCurrent
                    ? "border-brass bg-brass text-paper"
                    : "border-slate-light bg-paper text-slate",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <span
                className={[
                  "manifest-label whitespace-nowrap",
                  isCurrent ? "text-ink" : "text-slate",
                ].join(" ")}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className={[
                  "mx-2 mb-5 h-[2px] flex-1 transition-colors duration-300",
                  isComplete ? "bg-highway" : "bg-slate-light/40",
                ].join(" ")}
                style={
                  !isComplete
                    ? {
                        backgroundImage:
                          "repeating-linear-gradient(to right, currentColor 0, currentColor 6px, transparent 6px, transparent 12px)",
                      }
                    : undefined
                }
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
