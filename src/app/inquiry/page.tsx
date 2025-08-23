"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSearchTripsQuery, useGetCitiesQuery } from "@/services/tripApi";

type SortKey = "time" | "price";

export default function InquiryPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const fromCityId = Number(sp.get("fromCityId"));
  const toCityId = Number(sp.get("toCityId"));
  const date = sp.get("date") || "";

  const { data: trips, isFetching } = useSearchTripsQuery(
    { fromCityId, toCityId, date },
    { skip: !fromCityId || !toCityId || !date }
  );
  const { data: cities } = useGetCitiesQuery();

  const cityById = useMemo(
    () => new Map((cities ?? []).map((c) => [Number(c.id), c.name])),
    [cities]
  );
  const fromCity = cityById.get(fromCityId) ?? "—";
  const toCity = cityById.get(toCityId) ?? "—";

  // ufak sıralama ve fiyat aralığı filtresi
  const [sortBy, setSortBy] = useState<SortKey>("time");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const processed = useMemo(() => {
    let list = [...(trips ?? [])];
    if (typeof maxPrice === "number")
      list = list.filter((t) => t.price <= maxPrice);
    if (sortBy === "time") {
      list.sort((a, b) => a.time.localeCompare(b.time));
    } else {
      list.sort((a, b) => a.price - b.price);
    }
    return list;
  }, [trips, sortBy, maxPrice]);

  // skeleton kart
  const Skeleton = () => (
    <div className="animate-pulse bg-gray-100 rounded-xl p-4 h-28" />
  );

  const back = () => router.back();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* başlık/özet */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <button
              onClick={back}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ← Geri
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
              {fromCity} → {toCity}
            </h1>
            <p className="text-gray-600">
              {date} • {trips?.length ?? 0} sonuç
            </p>
          </div>

          {/* filtre/sıralama */}
          {/* <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-700">
                Sırala
              </label>
              <select
                id="sort"
                className="h-10 rounded-lg border border-gray-300 bg-white px-3"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="time">Saat (Artan)</option>
                <option value="price">Fiyat (Artan)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="max" className="text-sm text-gray-700">
                Maks. Fiyat
              </label>
              <input
                id="max"
                type="number"
                inputMode="numeric"
                min={0}
                className="h-10 w-28 rounded-lg border border-gray-300 bg-white px-3"
                value={maxPrice === "" ? "" : String(maxPrice)}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="₺"
              />
            </div>
          </div> */}
        </div>

        {/* liste */}
        <div className="grid gap-4">
          {isFetching && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}

          {!isFetching && processed.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="text-lg font-semibold mb-1">
                Uygun sefer bulunamadı
              </div>
              <p className="text-gray-600">
                Filtreleri gevşetmeyi ya da farklı bir tarih seçmeyi deneyin.
              </p>
              <div className="mt-4">
                <button
                  onClick={back}
                  className="h-10 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Aramayı Değiştir
                </button>
              </div>
            </div>
          )}

          {processed.map((t) => {
            const totalSeats = t.busLayout.rows * t.busLayout.colsPerSide * 2;
            const emptySeats = totalSeats - (t.occupiedSeats?.length ?? 0);
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {t.time}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{date}</div>
                    <div className="text-lg font-semibold">
                      {fromCity} → {toCity}
                    </div>
                    <div className="text-sm text-gray-600">
                      Boş Koltuk:{" "}
                      <span className="font-medium">{emptySeats}</span> /{" "}
                      {totalSeats}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Fiyat
                    </div>
                    <div className="text-2xl font-extrabold">₺{t.price}</div>
                  </div>
                  <a
                    href={`/trip/${t.id}`}
                    className="h-11 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-700"
                  >
                    Detaya Git
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* alt bilgi */}
        {!isFetching && processed.length > 0 && (
          <p className="text-xs text-gray-500 mt-4">
            Fiyatlar seçtiğiniz tarihte geçerlidir. Koltuk uygunluğu anlık
            olarak değişebilir.
          </p>
        )}
      </div>
    </div>
  );
}
