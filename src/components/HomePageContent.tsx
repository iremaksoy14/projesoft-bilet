"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useGetCitiesQuery } from "@/services/tripApi";
import Select from "@/components/Select"; // önceki Listbox tabanlı select
import DatePicker from "@/components/DatePicker"; // önceki popover+portal takvim

export default function HomePageContent() {
  const { data: cities, isLoading } = useGetCitiesQuery();
  const router = useRouter();

  // Select bileşeni string değer bekliyor → id'yi string olarak tutalım
  const [fromCityId, setFromCityId] = useState<string | null>(null);
  const [toCityId, setToCityId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [touched, setTouched] = useState(false);

  const cityOptions = useMemo(
    () =>
      (cities ?? []).map((c) => ({
        label: c.name,
        value: String(c.id),
      })),
    [cities]
  );

  const hasError =
    touched && (!fromCityId || !toCityId || !date || fromCityId === toCityId);

  const onSearch = () => {
    setTouched(true);
    if (!fromCityId || !toCityId || !date || fromCityId === toCityId) return;

    const q = new URLSearchParams({
      fromCityId,
      toCityId,
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD
    });
    router.push(`/inquiry?${q.toString()}`);
  };

  const swap = () => {
    setFromCityId(toCityId);
    setToCityId(fromCityId);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start md:items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">
          Otobüs Bilet Arama
        </h1>

        {/* Kart içeriği */}
        <div className="grid gap-5">
          {/* From / To satırı */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kalkış</label>
              <Select
                value={fromCityId ?? null}
                onChange={(v) => setFromCityId(v)}
                options={cityOptions}
                placeholder={isLoading ? "Yükleniyor…" : "Şehir seçin"}
              />
            </div>

            {/* Swap */}
            <div className="flex items-end md:items-center justify-center">
              <button
                type="button"
                onClick={swap}
                className="mt-2 md:mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
                title="Kalkış / Varış değiştir"
              >
                <ArrowsRightLeftIcon className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Varış</label>
              <Select
                value={toCityId ?? null}
                onChange={(v) => setToCityId(v)}
                options={cityOptions}
                placeholder={isLoading ? "Yükleniyor…" : "Şehir seçin"}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Sefer Tarihi
            </label>
            <DatePicker
              value={date ?? undefined}
              onChange={(d) => setDate(d)}
            />
          </div>

          {/* Hata & buton */}
          {hasError && (
            <p className="text-sm text-red-600 -mt-2">
              Lütfen kalkış / varış şehirlerini farklı seçin ve tarih girin.
            </p>
          )}

          <button
            type="button"
            onClick={onSearch}
            className={`h-11 rounded-lg text-white font-semibold transition
              ${
                !fromCityId || !toCityId || !date || fromCityId === toCityId
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            Sefer Ara
          </button>
        </div>
      </div>
    </div>
  );
}
