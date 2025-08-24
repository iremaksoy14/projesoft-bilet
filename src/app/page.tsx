"use client";
import { useAppSelector } from "@/lib/hooks";
import HomePageContent from "@/components/HomePageContent";

export default function HomePage() {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) {
    return <div className="p-6">Yönlendiriliyor...</div>;
  }

  return <HomePageContent />;
}
