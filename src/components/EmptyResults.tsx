export function EmptyResults({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path
            d="M10 6h10M4 6h.01M4 12h.01M4 18h.01M10 12h10M10 18h10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        Uygun sefer bulunamadı
      </h3>

      <p className="mt-2 text-gray-600">
        Farklı bir tarih seçmeyi ya da kalkış/varış şehirlerini değiştirerek
        tekrar deneyin.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={onBack}
          className="h-11 px-5 text-white  bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Aramayı Değiştir
        </button>
      </div>

      <div className="mt-6 rounded-xl bg-indigo-50/50 border border-indigo-100 p-4 text-sm text-indigo-900">
        İpucu: En fazla sefer için hafta içi tarihleri deneyin.
      </div>
    </div>
  );
}
