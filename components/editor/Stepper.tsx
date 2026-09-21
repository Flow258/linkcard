const STEPS = ["Details", "Extras", "Template", "Customize", "Username", "Publish"];

export default function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex w-full items-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum === current ? "current" : stepNum < current ? "done" : "upcoming";
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  state === "upcoming"
                    ? "bg-black/5 text-ink-soft"
                    : "bg-ink text-paper"
                }`}
              >
                {stepNum}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  state === "upcoming" ? "text-ink-soft" : "font-medium text-ink"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum !== STEPS.length && (
              <div className={`h-px flex-1 ${state === "done" ? "bg-ink" : "bg-black/10"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
