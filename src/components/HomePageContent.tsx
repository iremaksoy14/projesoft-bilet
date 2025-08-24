"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowsRightLeftIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useGetCitiesQuery } from "@/services/tripApi";
import Select from "@/components/Select";
import DatePicker from "@/components/DatePicker";
import { toYYYYMMDD } from "@/helpers";
export default function HomePageContent() {
  const { data: cities, isLoading } = useGetCitiesQuery();
  const router = useRouter();

  const [fromCityId, setFromCityId] = useState<string | null>(null);
  const [toCityId, setToCityId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allOptions = useMemo(
    () => (cities ?? []).map((c) => ({ label: c.name, value: String(c.id) })),
    [cities]
  );

  const fromOptions = useMemo(
    () => allOptions.filter((o) => o.value !== toCityId),
    [allOptions, toCityId]
  );
  const toOptions = useMemo(
    () => allOptions.filter((o) => o.value !== fromCityId),
    [allOptions, fromCityId]
  );

  const equalityError = fromCityId && toCityId && fromCityId === toCityId;
  const hasError =
    touched && (!fromCityId || !toCityId || !date || equalityError);

  const onChangeFrom = (v: string | null) => {
    setFromCityId(v);
    if (v && v === toCityId) {
      setError("Kalkış ve varış şehirleri farklı olmalı.");
    } else {
      setError(null);
    }
  };

  const onChangeTo = (v: string | null) => {
    setToCityId(v);
    if (v && v === fromCityId) {
      setError("Kalkış ve varış şehirleri farklı olmalı.");
    } else {
      setError(null);
    }
  };

  const onSearch = () => {
    setTouched(true);

    if (!fromCityId || !toCityId || !date) {
      setError("Lütfen kalkış, varış ve tarih seçin.");
      return;
    }
    if (fromCityId === toCityId) {
      setError("Kalkış ve varış şehirleri farklı olmalı.");
      return;
    }

    setError(null);
    const q = new URLSearchParams({
      fromCityId,
      toCityId,
      date: toYYYYMMDD(new Date(date)),
    });
    router.push(`/inquiry?${q.toString()}`);
  };

  const swap = () => {
    setFromCityId(toCityId);
    setToCityId(fromCityId);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden bg-white">
        <div className="h-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600" />
        <div className="p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Otobüs Bilet Arama
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kalkış/varış şehirlerini ve tarihi seçin; uygun seferleri
            listeleyelim.
          </p>

          <div className="grid gap-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
              {/* Kalkış */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Kalkış
                </label>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Select
                      value={fromCityId ?? null}
                      onChange={onChangeFrom}
                      options={fromOptions}
                      placeholder={isLoading ? "Yükleniyor…" : "Şehir seçin"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-end md:items-center justify-center">
                <button
                  type="button"
                  onClick={swap}
                  className="mt-2 md:mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 hover:bg-gray-50 text-gray-500"
                  title="Kalkış / Varış değiştir"
                >
                  <ArrowsRightLeftIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Varış */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Varış
                </label>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Select
                      value={toCityId ?? null}
                      onChange={onChangeTo}
                      options={toOptions}
                      placeholder={isLoading ? "Yükleniyor…" : "Şehir seçin"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tarih */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Sefer Tarihi
              </label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <DatePicker
                    value={date ?? undefined}
                    onChange={(d) => setDate(d)}
                  />
                </div>
              </div>
            </div>

            {(hasError || error) && (
              <p
                className="text-sm text-red-600 -mt-2"
                role="alert"
                aria-live="polite"
              >
                {error ??
                  "Lütfen kalkış & varış şehirlerini farklı seçin ve tarih girin."}
              </p>
            )}

            {/* Arama */}
            <button
              type="button"
              onClick={onSearch}
              className={`h-11 w-full rounded-xl text-white font-semibold shadow transition
                ${
                  !fromCityId || !toCityId || !date || fromCityId === toCityId
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500"
                }`}
            >
              Sefer Ara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
