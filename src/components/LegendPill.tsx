export function LegendPill({ color, label }: { color: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 ${color}`}
    >
      <span className="inline-block h-2.5 w-2.5 rounded-full border border-white/50 bg-current" />
      <span className="text-gray-700">{label}</span>
    </span>
  );
}
