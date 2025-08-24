# Otobüs Bilet Uygulaması (Projesoft Case)

ProjeSoft Bilet – Ticket App

Modern bir biletleme uygulaması. Kullanıcılar kayıt olabilir, giriş yapabilir, sefer arayabilir, koltuk seçip sahte ödeme ile rezervasyonunu tamamlayabilir. Frontend Next.js (App Router) ve TypeScript; durum yönetimi Redux Toolkit + RTK Query; arayüz Tailwind üzerine kurulu. Geliştirme sırasında json-server ile fake API kullanılır.

## Teknolojiler

- Next.js (App Router) – TypeScript
- Redux Toolkit + RTK Query
- Tailwind CSS, Headless UI
- Yup, Formik
- json-server (Mock API)
- react-day-picker

## Özellikler

- Kayıt / Giriş (Formik + Yup doğrulama, client-side guard)
- Sefer arama: şehir, tarih ile filtreleme
- Koltuk seçimi & rezervasyon (RTK Query mutation)
- Ödeme simülasyonu (kart bilgisi doğrulama, gerçek ödeme yok)
- Mock API: json-server ile users, cities, trips
- Tip güvenliği: TypeScript, unwrap() ile thunk sonuçları

## Kurulum

````bash
npm install
npm run dev
# http://localhost:3000



## Mock json-server'ı başlatmak için
```bash
npm run mock

## Kullanıcı bilgisi
demo@user.com
Demo1234!





````
