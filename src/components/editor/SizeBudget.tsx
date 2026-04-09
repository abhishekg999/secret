interface SizeBudgetProps {
  usedBytes: number;
  maxBytes: number;
}

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
      <div className="h-1 flex-grow overflow-hidden bg-surface-inset">
        <div
          className={`h-full transition-all duration-300 ${
            isOver ? "bg-danger-muted" : isWarning ? "bg-warning" : "bg-accent-bar"
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span
        className={`flex-shrink-0 text-xs ${
          isOver ? "text-danger-muted" : isWarning ? "text-warning-content" : "text-content-faint"
        }`}
      >
        {formatSize(usedBytes)} / {formatSize(maxBytes)}
      </span>
    </div>
  );
};

export default SizeBudget;
