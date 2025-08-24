"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSearchTripsQuery, useGetCitiesQuery } from "@/services/tripApi";
import { Skeleton } from "@/components/Skeleton";
import { EmptyResults } from "@/components/EmptyResults";

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
  const processed = useMemo(() => {
    let list = [...(trips ?? [])];
    list.sort((a, b) => a.price - b.price);
    return list;
  }, [trips]);

  const back = () => router.push("/");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-indigo-50/30 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <button
                onClick={back}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                ← Geri
              </button>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
                {fromCity} → {toCity}
              </h1>
              <p className="text-gray-600">
                {date} • {trips?.length ?? 0} sonuç
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {isFetching && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}

          {!isFetching && processed.length === 0 && (
            <EmptyResults onBack={back} />
          )}

          {processed.map((t) => {
            const totalSeats = t.busLayout.rows * t.busLayout.colsPerSide * 2;
            const emptySeats = totalSeats - (t.occupiedSeats?.length ?? 0);
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-16 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                    {t.time}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{date}</div>
                    <div className="text-lg font-semibold text-gray-900">
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
                    <div className="text-2xl font-extrabold text-gray-900">
                      ₺{t.price}
                    </div>
                  </div>
                  <a
                    href={`/trip/${t.id}`}
                    className="h-11 inline-flex items-center justify-center rounded-lg px-5 font-semibold text-white
                               bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500"
                  >
                    Detaya Git
                  </a>
                </div>
              </div>
            );
          })}
        </div>

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
