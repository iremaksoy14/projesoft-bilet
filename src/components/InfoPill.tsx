export function InfoPill({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm ${
          strong ? "font-semibold text-gray-900" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </span>
  );
}