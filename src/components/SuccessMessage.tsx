"use client";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function SuccessMessage({
  title = "Başarılı!",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 shadow-sm animate-fade-in">
      <CheckCircleIcon className="h-6 w-6 text-green-600" />
      <div>
        <p className="font-semibold">{title}</p>
        {description && <p className="text-sm">{description}</p>}
      </div>
    </div>
  );
}
