"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  useGetTripByIdQuery,
  useReserveSeatsMutation,
} from "@/services/tripApi";
import { useAppSelector } from "@/lib/hooks";
import { formatCard, formatExp } from "@/helpers";
import { InfoPill } from "@/components/InfoPill";
import { FormArea } from "@/components/FormArea";
import { Row } from "@/components/Row";
import { SuccessMessage } from "@/components/SuccessMessage";

export default function PaymentPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const tripId = Number(sp.get("tripId"));
  const seats = (sp.get("seats") || "").split(";").filter(Boolean);

  const { data: trip, isFetching } = useGetTripByIdQuery(tripId, {
    skip: !tripId,
  });

  const total = useMemo(
    () => (trip ? seats.length * trip.price : 0),
    [trip, seats]
  );

  const [reserveSeats] = useReserveSeatsMutation();
  const [holder, setHolder] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const validate = () => {
    if (!holder || holder.trim().length < 3)
      return "Kart üzerindeki isim geçersiz";
    if (card.replace(/\s/g, "").length !== 16)
      return "Kart numarası 16 haneli olmalı";
    if (!/^\d{2}\/\d{2}$/.test(exp)) return "SKT MM/YY formatında olmalı";
    const [mm] = exp.split("/").map((s) => Number(s));
    if (mm < 1 || mm > 12) return "Geçersiz ay";
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv))
      return "CVV 3-4 haneli olmalı";
    if (!agree) return "Ön bilgilendirme ve sözleşmeyi onaylayın";
    return null;
  };

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    if (!trip) return;

    setLoading(true);
    try {
      await reserveSeats({
        tripId,
        seats,
        gender: (user?.gender as "M" | "F") ?? "F",
      }).unwrap();

      setSuccess(true);
      setTimeout(() => router.push("/"), 4000);
    } catch (e: any) {
      const msg =
        e?.data?.message ||
        "İşlem sırasında bir sorun oluştu. Koltuklar dolu olabilir.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const gradientBtn =
    loading || isFetching || !trip
      ? "bg-indigo-300 cursor-not-allowed"
      : "bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-indigo-50/30 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {success && (
          <SuccessMessage
            title="Ödeme Başarılı 🎉"
            description="Ana sayfaya yönlendiriliyorsunuz..."
          />
        )}
        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-4 text-white">
            <h1 className="text-2xl md:text-3xl font-extrabold">Ödeme</h1>
            <p className="text-white/80 text-sm">Güvenli ödeme sayfası</p>
          </div>
          {!trip || isFetching ? (
            <div className="p-6">
              <div className="animate-pulse h-6 bg-gray-100 rounded w-1/3" />
            </div>
          ) : (
            <div className="p-6 flex flex-wrap items-center gap-6 text-sm text-gray-700">
              <InfoPill label="Sefer" value={`${trip.date} • ${trip.time}`} />
              <InfoPill label="Koltuklar" value={seats.join(", ") || "-"} />
              <InfoPill label="Adet" value={String(seats.length)} />
              <InfoPill label="Toplam" value={`₺${total}`} strong />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-700 text-white p-5">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider opacity-90">
                    Sanal Kart • Güvenli Ödeme
                  </span>
                  <span className="text-xs opacity-90">₺{total}</span>
                </div>
                <div className="mt-6 text-2xl font-mono tracking-widest">
                  {card || "**** **** **** ****"}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="opacity-90">{holder || "AD SOYAD"}</span>
                  <span className="opacity-90">{exp || "MM/YY"}</span>
                </div>
              </div>
            </div>

            <form onSubmit={onPay} className="grid gap-4">
              <FormArea
                label="Kart Üzerindeki İsim"
                input={
                  <input
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="AD SOYAD"
                    autoComplete="cc-name"
                    value={holder}
                    onChange={(e) => setHolder(e.target.value.toUpperCase())}
                  />
                }
              />

              <FormArea
                label="Kart Numarası"
                input={
                  <input
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={card}
                    onChange={(e) => setCard(formatCard(e.target.value))}
                  />
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <FormArea
                  label="SKT (AA/YY)"
                  input={
                    <input
                      className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={exp}
                      onChange={(e) => setExp(formatExp(e.target.value))}
                    />
                  }
                />
                <FormArea
                  label="CVV"
                  input={
                    <input
                      className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                    />
                  }
                />
              </div>

              <label className="flex items-center gap-3 text-sm mt-1">
                <input
                  type="checkbox"
                  className=" h-4 w-4 rounded border-gray-300"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-gray-700">
                  <span className="font-medium">Ön bilgilendirme formu</span> ve{" "}
                  <span className="font-medium">mesafeli satış sözleşmesi</span>{" "}
                  şartlarını okudum, kabul ediyorum.
                </span>
              </label>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <button
                type="submit"
                disabled={loading || isFetching || !trip}
                className={`mt-2 h-11 rounded-lg font-semibold text-white transition ${gradientBtn}`}
              >
                {loading ? "İşleniyor…" : `Ödeme Yap  • ₺${total}`}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="h-11 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Geri Dön
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit lg:sticky lg:top-6">
            {!trip || isFetching ? (
              <div className="animate-pulse bg-gray-100 rounded-xl h-40" />
            ) : (
              <>
                <div className="text-lg font-semibold mb-3 text-gray-900">
                  Seyahat Özeti
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <Row label="Sefer" value={`${trip.date} • ${trip.time}`} />
                  <Row
                    label="Koltuklar"
                    value={seats.join(", ") || "-"}
                    multi
                  />
                  <Row label="Birim Fiyat" value={`₺${trip.price}`} />
                  <Row label="Adet" value={String(seats.length)} />
                  <div className="border-t my-2" />
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold text-gray-900">Toplam</span>
                    <span className="font-extrabold text-gray-900">
                      ₺{total}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Bu sayfa test amaçlıdır; kart verileri gerçek sunucuya iletilmez.
        </p>
      </div>
    </div>
  );
}
