"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className="pt-0">{children}</main>
    </div>
  );
}
