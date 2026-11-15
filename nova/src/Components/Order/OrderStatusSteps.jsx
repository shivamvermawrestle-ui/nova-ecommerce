
const stages = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

const OrderStatusSteps = ({ status = "PLACED", dark = false }) => {
  if (status === "CANCELLED") {
    return (
      <p
        className={`text-sm font-semibold ${
          dark ? "text-[#F08089]" : "text-[#C04452]"
        }`}
      >
        This order was cancelled.
      </p>
    );
  }

  const currentIndex = Math.max(stages.indexOf(status), 0);

  const completedStep = dark
    ? "bg-[#7895C5] text-[#171E30]"
    : "bg-[#344F82] text-white";

  const pendingStep = dark
    ? "bg-[#35435C] text-[#8190AA]"
    : "bg-[#D8E1EF] text-[#64718A]";

  const stepText = dark ? "text-[#EAF0FA]" : "text-[#202C50]";

  return (
    <ol
      aria-label="Order progress"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {stages.map((stage, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={stage} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                index <= currentIndex ? completedStep : pendingStep
              }`}
            >
              {isDone ? "✓" : index + 1}
            </span>

            <span
              className={`text-xs font-semibold sm:text-sm ${
                isCurrent
                  ? `font-bold ${stepText}`
                  : `${stepText} opacity-80`
              }`}
            >
              {stage.charAt(0) + stage.slice(1).toLowerCase()}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStatusSteps;
