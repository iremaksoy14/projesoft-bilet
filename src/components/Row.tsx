export function Row({
  label,
  value,
  multi = false,
}: {
  label: string;
  value: string;
  multi?: boolean;
}) {
  return (
    <div
      className={`flex ${
        multi ? "items-start" : "items-center"
      } justify-between`}
    >
      <span>{label}</span>
      <span
        className={`font-medium ${
          multi ? "max-w-[240px] text-right break-words" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
