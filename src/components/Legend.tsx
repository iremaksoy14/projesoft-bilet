import { LegendPill } from "./LegendPill";
export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <LegendPill color="bg-white border-gray-300" label="Boş" />
      <LegendPill
        color="bg-gradient-to-r from-fuchsia-100 to-indigo-100 border-indigo-200"
        label="Seçili"
      />
      <LegendPill color="bg-blue-100 border-blue-200" label="Dolu (E)" />
      <LegendPill color="bg-rose-100 border-rose-200" label="Dolu (K)" />
    </div>
  );
}
