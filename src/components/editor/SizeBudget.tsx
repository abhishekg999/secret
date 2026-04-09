type SizeBudgetProps = {
  usedBytes: number;
  maxBytes: number;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const SizeBudget = ({ usedBytes, maxBytes }: SizeBudgetProps) => {
  const ratio = Math.min(usedBytes / maxBytes, 1);
  const isWarning = ratio > 0.8;
  const isOver = ratio >= 1;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow h-1 bg-gray-700 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isOver
              ? "bg-red-500"
              : isWarning
                ? "bg-yellow-500"
                : "bg-purple-600"
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span
        className={`text-xs flex-shrink-0 ${
          isOver
            ? "text-red-400"
            : isWarning
              ? "text-yellow-400"
              : "text-gray-500"
        }`}
      >
        {formatSize(usedBytes)} / {formatSize(maxBytes)}
      </span>
    </div>
  );
};

export default SizeBudget;
