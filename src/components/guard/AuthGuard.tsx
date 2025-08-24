"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/slices/authSlice";
import { loadUser } from "@/lib/storage";
import Header from "@/components/Header"; // varsa

const PUBLIC_ROUTES = ["/login", "/register"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [mounted, setMounted] = useState(false);
  const [rehydrated, setRehydrated] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      const u = loadUser();
      if (u) dispatch(setUser(u));
    }
    setRehydrated(true);
  }, [mounted, user, dispatch]);

  const isPublic = useMemo(
    () =>
      PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/")),
    [pathname]
  );

  useEffect(() => {
    if (!mounted || !rehydrated) return;
    if (isPublic) return;
    if (!user) router.replace("/login");
  }, [mounted, rehydrated, isPublic, user, router]);

  if (!mounted || !rehydrated) return null;
  if (!isPublic && !user)
    return <div className="p-6 text-sm text-gray-600">Yönlendiriliyor…</div>;

  if (isPublic) return <>{children}</>;

  console.log(user, "user");
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  );
}
