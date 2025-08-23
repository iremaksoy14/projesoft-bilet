"use client";

import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HomePageContent from "@/components/HomePageContent"; // mevcut homepage içeriğini buraya taşıyoruz

export default function HomePage() {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    // Kullanıcı login değilken, yönlendirme yapılana kadar boş render
    return <div className="p-6">Yönlendiriliyor...</div>;
  }

  // Kullanıcı login ise normal homepage açılır
  return <HomePageContent />;
}
