const stages = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

const OrderStatusSteps = ({ status = "PLACED" }) => {
  if (status === "CANCELLED") {
    return <p className="text-sm font-semibold text-red-500">This order was cancelled.</p>;
  }
  const currentIndex = Math.max(stages.indexOf(status), 0);
  return (
    <ol aria-label="Order progress" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stages.map((stage, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={stage} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 shrink-0 rounded-full items-center justify-center text-[10px] font-bold transition-colors ${
                index <= currentIndex
                  ? "bg-[#202C50] text-white dark:bg-[#7895C5] dark:text-[#171E30]"
                  : "bg-[#D8E1EF] text-[#64718A] dark:bg-[#35435C] dark:text-[#8190AA]"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </span>
            <span className={`text-xs sm:text-sm font-semibold ${isCurrent ? "font-bold" : "opacity-80"}`}>
              {stage.charAt(0) + stage.slice(1).toLowerCase()}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStatusSteps;
