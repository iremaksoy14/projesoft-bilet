import type { ReactNode } from "react";
export function FormArea({
  label,
  input,
}: {
  label: string;
  input: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-800">
        {label}
      </label>
      {input}
    </div>
  );
}
