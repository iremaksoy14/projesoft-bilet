"use client";
import { useParams, useRouter } from "next/navigation";
import { useGetTripByIdQuery } from "@/services/tripApi";
import { useAppSelector } from "@/lib/hooks";
import { useMemo, useState } from "react";
import { Legend } from "../../../components/Legend";
import { SeatPair } from "@/components/Seatpair";
import { Row } from "@/components/Row";
import { seatLabel } from "@/helpers";
import { ErrorMessage } from "@/components/messages/ErrorMessage";
export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = Number(id);

  const { data: trip, isFetching } = useGetTripByIdQuery(tripId, {
    skip: !tripId,
  });

  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const occupiedMap = useMemo(
    () => new Map(trip?.occupiedSeats?.map((o) => [o.seatNo, o.gender]) || []),
    [trip]
  );

  if (!trip || isFetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-indigo-50/30 px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="animate-pulse bg-white rounded-2xl border border-gray-200 shadow h-64" />
        </div>
      </div>
    );
  }

  const maxSeats = 5;

  const toggleSeat = (seatNo: string) => {
    if (occupiedMap.has(seatNo)) return;
    if (selected.includes(seatNo)) {
      setSelected(selected.filter((s) => s !== seatNo));
      return;
    }
    if (selected.length >= maxSeats) {
      setError("En fazla 5 koltuk seçebilirsiniz");
      return;
    }

    const pairMap: Record<string, string> = { A: "B", B: "A", C: "D", D: "C" };
    const row = seatNo.slice(0, -1);
    const letter = seatNo.slice(-1);
    const pairSeat = `${row}${pairMap[letter]}`;
    const pairOccupiedGender = occupiedMap.get(pairSeat);

    if (
      pairOccupiedGender &&
      user?.gender &&
      user.gender !== pairOccupiedGender &&
      !selected.includes(pairSeat)
    ) {
      alert("Yan koltuk doluysa karşı cins yanına oturamazsınız.");
      return;
    }

    setSelected([...selected, seatNo]);
  };

  const total = selected.length * trip.price;

  // useEffect(() => {
  //   if (selected.length < maxSeats && error) setError(null);
  // }, [selected, error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-indigo-50/30 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-4 text-white">
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Sefer Detayları
            </h1>
          </div>
          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-gray-700">
              Tarih: <span className="font-medium">{trip.date}</span> • Saat:{" "}
              <span className="font-medium">{trip.time}</span>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Fiyat / Kişi
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                ₺{trip.price}
              </div>
            </div>
          </div>
        </div>

        {error && selected.length >= 5 && <ErrorMessage message={error} />}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  Koltuk Seçimi
                </span>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 border border-indigo-100">
                  Seçili: {selected.length}/{maxSeats}
                </span>
              </div>
              <Legend />
            </div>

            <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                🛞 <b>Ön</b> (Sürücü)
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 border text-gray-600">
                2+2 Düzen
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="inline-flex flex-col gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                {Array.from({ length: trip.busLayout.rows }).map((_, r) => (
                  <div key={r} className="flex items-center gap-5">
                    <div className="w-8 text-center text-xs text-gray-500">
                      {r + 1}
                    </div>
                    <SeatPair
                      cols={trip.busLayout.colsPerSide}
                      make={(c) => seatLabel(r + 1, c, "L")}
                      occupiedMap={occupiedMap}
                      selected={selected}
                      toggle={toggleSeat}
                    />

                    <div className="w-10">
                      <div className="mx-auto h-1 w-10 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
                    </div>

                    <SeatPair
                      cols={trip.busLayout.colsPerSide}
                      make={(c) => seatLabel(r + 1, c, "R")}
                      occupiedMap={occupiedMap}
                      selected={selected}
                      toggle={toggleSeat}
                    />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              En fazla {maxSeats} koltuk seçebilirsiniz.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit lg:sticky lg:top-6">
            <div className="text-lg font-semibold text-gray-900 mb-3">
              Ödeme Özeti
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <Row label="Sefer" value={`${trip.date} • ${trip.time}`} />
              <Row
                label="Seçili Koltuklar"
                value={selected.length ? selected.join(", ") : "-"}
                multi
              />
              <Row label="Birim Fiyat" value={`₺${trip.price}`} />
              <div className="border-t my-2" />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-gray-900">Toplam</span>
                <span className="font-extrabold text-gray-900">₺{total}</span>
              </div>
            </div>

            <button
              disabled={selected.length === 0}
              onClick={() =>
                router.push(
                  `/payment?tripId=${trip.id}&seats=${selected.join(";")}`
                )
              }
              className={`mt-4 h-11 w-full rounded-lg text-white font-semibold transition ${
                selected.length === 0
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500"
              }`}
            >
              Ödeme
            </button>

            <button
              onClick={() => router.back()}
              className="mt-2 h-11 w-full text-black rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
