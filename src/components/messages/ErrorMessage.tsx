"use client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 shadow-sm animate-fade-in">
      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
      <div>
        <p className="font-semibold">Hata</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
