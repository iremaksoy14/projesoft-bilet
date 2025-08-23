"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetTripByIdQuery } from "@/services/tripApi";
import { useAppSelector } from "@/lib/hooks";
import { useMemo, useState, useEffect } from "react";

function seatLabel(row: number, col: number, side: "L" | "R") {
  const letter = side === "L" ? (col === 0 ? "A" : "B") : col === 0 ? "C" : "D";
  return `${row}${letter}`;
}

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = Number(id);
  const { data: trip, isFetching } = useGetTripByIdQuery(tripId, {
    skip: !tripId,
  });
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  // // login guard (opsiyonel ama iyi deneyim)
  // useEffect(() => {
  //   if (!user) router.replace("/login");
  // }, [user, router]);

  const [selected, setSelected] = useState<string[]>([]);
  const occupiedMap = useMemo(
    () => new Map(trip?.occupiedSeats?.map((o) => [o.seatNo, o.gender]) || []),
    [trip]
  );

  if (!trip || isFetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="animate-pulse bg-white rounded-2xl shadow p-8 h-64" />
        </div>
      </div>
    );
  }

  const maxSeats = 5;

  const toggleSeat = (seatNo: string) => {
    if (occupiedMap.has(seatNo)) return; // dolu
    const already = selected.includes(seatNo);
    if (already) {
      setSelected(selected.filter((s) => s !== seatNo));
      return;
    }
    if (selected.length >= maxSeats) {
      alert("En fazla 5 koltuk seçebilirsiniz");
      return;
    }

    // Karşı cins yanına kuralı
    const pairMap: Record<string, string> = { A: "B", B: "A", C: "D", D: "C" };
    const row = seatNo.slice(0, -1);
    const letter = seatNo.slice(-1);
    const pairSeat = `${row}${pairMap[letter]}`; // ✔️
    const pairOccupiedGender = occupiedMap.get(pairSeat);

    if (
      pairOccupiedGender &&
      user?.gender &&
      user.gender !== pairOccupiedGender
    ) {
      const pairInSelected = selected.includes(pairSeat);
      if (!pairInSelected) {
        alert(
          "Yan yana koltuk birlikte alınmıyorsa karşı cins yanına oturamazsınız."
        );
        return;
      }
    }

    setSelected([...selected, seatNo]);
  };

  const total = selected.length * trip.price;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Başlık / Özet */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Sefer Detayları
              </h1>
              <p className="text-gray-600">
                Tarih: <span className="font-medium">{trip.date}</span> • Saat:{" "}
                <span className="font-medium">{trip.time}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Fiyat / Kişi
              </div>
              <div className="text-3xl font-extrabold">₺{trip.price}</div>
            </div>
          </div>
        </div>

        {/* İçerik grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Sol: Koltuk planı */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Koltuk Seçimi</div>
              {/* Legend */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded border bg-white" />{" "}
                  Boş
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded border bg-green-200" />{" "}
                  Seçili
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded border bg-blue-200" />{" "}
                  Dolu (E)
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded border bg-pink-200" />{" "}
                  Dolu (K)
                </div>
              </div>
            </div>

            {/* Koltuk grid */}
            <div className="w-full overflow-x-auto">
              <div className="inline-flex flex-col gap-3 p-2 rounded-lg bg-gray-50">
                {Array.from({ length: trip.busLayout.rows }).map((_, r) => (
                  <div key={r} className="flex gap-8 items-center">
                    {/* Sol ikili */}
                    <div className="flex gap-2">
                      {Array.from({ length: trip.busLayout.colsPerSide }).map(
                        (_, c) => {
                          const s = seatLabel(r + 1, c, "L");
                          const occ = occupiedMap.get(s);
                          const chosen = selected.includes(s);
                          return (
                            <button
                              key={s}
                              onClick={() => toggleSeat(s)}
                              className={`w-12 h-12 rounded-lg border flex items-center justify-center text-sm font-medium
                              ${
                                occ
                                  ? occ === "M"
                                    ? "bg-blue-200 cursor-not-allowed"
                                    : "bg-pink-200 cursor-not-allowed"
                                  : chosen
                                  ? "bg-green-200"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                              disabled={!!occ}
                              title={occ ? `Dolu (${occ})` : s}
                            >
                              {s}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Koridor */}
                    <div className="w-8 h-1 bg-gray-300 rounded-full" />

                    {/* Sağ ikili */}
                    <div className="flex gap-2">
                      {Array.from({ length: trip.busLayout.colsPerSide }).map(
                        (_, c) => {
                          const s = seatLabel(r + 1, c, "R");
                          const occ = occupiedMap.get(s);
                          const chosen = selected.includes(s);
                          return (
                            <button
                              key={s}
                              onClick={() => toggleSeat(s)}
                              className={`w-12 h-12 rounded-lg border flex items-center justify-center text-sm font-medium
                              ${
                                occ
                                  ? occ === "M"
                                    ? "bg-blue-200 cursor-not-allowed"
                                    : "bg-pink-200 cursor-not-allowed"
                                  : chosen
                                  ? "bg-green-200"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                              disabled={!!occ}
                              title={occ ? `Dolu (${occ})` : s}
                            >
                              {s}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Not: En fazla {maxSeats} koltuk seçebilirsiniz. “Karşı cins yanı”
              kuralı gereği yan koltuk doluysa ikili birlikte alınmalıdır.
            </p>
          </div>

          {/* Sağ: Özet kartı */}
          <div className="bg-white rounded-2xl shadow p-6 h-fit lg:sticky lg:top-6">
            <div className="text-lg font-semibold mb-3">Ödeme Özeti</div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Sefer</span>
                <span className="font-medium">
                  {trip.date} • {trip.time}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span>Seçili Koltuklar</span>
                <span className="font-medium text-right break-words max-w-[220px]">
                  {selected.length ? selected.join(", ") : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Birim Fiyat</span>
                <span className="font-medium">₺{trip.price}</span>
              </div>
              <div className="border-t my-2" />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Toplam</span>
                <span className="font-extrabold">₺{total}</span>
              </div>
            </div>

            <button
              disabled={selected.length === 0}
              onClick={() =>
                router.push(
                  `/payment?tripId=${trip.id}&seats=${selected.join(";")}`
                )
              }
              className={`mt-4 h-11 w-full rounded-lg font-semibold text-white transition
                ${
                  selected.length === 0
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              Devam (Ödeme)
            </button>

            <button
              onClick={() => router.back()}
              className="mt-2 h-11 w-full rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
