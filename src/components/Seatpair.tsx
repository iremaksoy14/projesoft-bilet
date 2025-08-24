import { useAppSelector } from "@/lib/hooks";
export function SeatPair({
  cols,
  make,
  occupiedMap,
  selected,
  toggle,
}: {
  cols: number;
  make: (c: number) => string;
  occupiedMap: Map<string, "M" | "F">;
  selected: string[];
  toggle: (s: string) => void;
}) {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="flex gap-3">
      {Array.from({ length: cols }).map((_, c) => {
        const s = make(c);
        const occ = occupiedMap.get(s);
        const chosen = selected.includes(s);

        const selectedGender: "M" | "F" | undefined =
          chosen && user?.gender ? user.gender : undefined;

        const tooltip = occ
          ? `Dolu (${occ})`
          : selectedGender
          ? `Seçili (${selectedGender})`
          : s;

        const base =
          "relative w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-semibold transition text-black";
        const ring = chosen ? "ring-2 ring-indigo-400/70" : "ring-0";

        let style = "bg-white hover:bg-gray-50 border-gray-300";
        if (occ) {
          style =
            occ === "M"
              ? "bg-blue-100 border-blue-200 cursor-not-allowed"
              : "bg-rose-100 border-rose-200 cursor-not-allowed";
        } else if (chosen) {
          style =
            "bg-gradient-to-br from-fuchsia-100 to-indigo-100 border-indigo-300";
        }

        const chipGender = occ ?? selectedGender;
        const chipClass =
          chipGender === "M"
            ? "bg-blue-200/80 border-blue-300 text-blue-900"
            : "bg-rose-200/80 border-rose-300 text-rose-900";

        return (
          <button
            key={s}
            onClick={() => toggle(s)}
            disabled={!!occ}
            title={tooltip}
            className={`${base} ${style} ${ring}`}
          >
            {s}
            {chipGender && (
              <span
                className={`absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full border ${chipClass}`}
              >
                {chipGender}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
