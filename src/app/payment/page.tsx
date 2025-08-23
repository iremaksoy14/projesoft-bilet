"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useGetTripByIdQuery } from "@/services/tripApi";
import { useAppSelector } from "@/lib/hooks";

export default function PaymentPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  // // login guard
  // useEffect(() => {
  //   if (!user) router.replace("/login");
  // }, [user, router]);

  const tripId = Number(sp.get("tripId"));
  const seats = (sp.get("seats") || "").split(";").filter(Boolean);
  const { data: trip, isFetching } = useGetTripByIdQuery(tripId, {
    skip: !tripId,
  });

  const total = useMemo(
    () => (trip ? seats.length * trip.price : 0),
    [trip, seats]
  );

  // form state
  const [holder, setHolder] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // küçük yardımcılar
  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
  const formatExp = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/(\d{2})(?=\d)/, "$1/");

  const validate = () => {
    if (!holder || holder.trim().length < 3)
      return "Kart üzerindeki isim geçersiz";
    if (card.replace(/\s/g, "").length !== 16)
      return "Kart numarası 16 haneli olmalı";
    if (!/^\d{2}\/\d{2}$/.test(exp)) return "SKT MM/YY formatında olmalı";
    const [mm, yy] = exp.split("/").map((s) => Number(s));
    if (mm < 1 || mm > 12) return "Geçersiz ay";
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv))
      return "CVV 3-4 haneli olmalı";
    if (!agree)
      return "Ön bilgilendirme ve mesafeli satış sözleşmesini onaylamalısınız";
    return null;
    // Not: Gerçek projede Luhn kontrolü, son kullanma tarihi geçmiş mi vs. de eklenir.
  };

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setLoading(true);
    // sahte bekleme
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert("Ödeme Başarılı 🎉");
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* başlık */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">Ödeme</h1>
          <p className="text-gray-600">Güvenli ödeme sayfası</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Sol: Kart formu */}
          <div className="bg-white rounded-2xl shadow p-6">
            <form onSubmit={onPay} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kart Üzerindeki İsim
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="AD SOYAD"
                  autoComplete="cc-name"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kart Numarası
                </label>
                <input
                  className="w-full h-11 rounded-lg border border-gray-300 px-3 tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={card}
                  onChange={(e) => setCard(formatCard(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    SKT (AA/YY)
                  </label>
                  <input
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={exp}
                    onChange={(e) => setExp(formatExp(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm mt-2">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  <span className="font-medium">Ön bilgilendirme formu</span> ve{" "}
                  <span className="font-medium">mesafeli satış sözleşmesi</span>{" "}
                  şartlarını okudum, kabul ediyorum.
                </span>
              </label>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <button
                type="submit"
                disabled={loading || isFetching || !trip}
                className={`mt-2 h-11 rounded-lg font-semibold text-white transition
                  ${
                    loading
                      ? "bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                {loading ? "İşleniyor…" : "Ödemeyi Onayla"}
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

          {/* Sağ: Özet */}
          <div className="bg-white rounded-2xl shadow p-6 h-fit lg:sticky lg:top-6">
            {!trip || isFetching ? (
              <div className="animate-pulse bg-gray-100 rounded-xl h-40" />
            ) : (
              <>
                <div className="text-lg font-semibold mb-3">Sipariş Özeti</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Sefer</span>
                    <span className="font-medium">
                      {trip.date} • {trip.time}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span>Koltuklar</span>
                    <span className="font-medium text-right break-words max-w-[220px]">
                      {seats.join(", ") || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Birim Fiyat</span>
                    <span className="font-medium">₺{trip.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Adet</span>
                    <span className="font-medium">{seats.length}</span>
                  </div>
                  <div className="border-t my-2" />
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold">Toplam</span>
                    <span className="font-extrabold">₺{total}</span>
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
