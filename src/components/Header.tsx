"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full  bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-end">
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:block text-sm text-gray-600">
              {user.firstName} {user.lastName}
            </span>
          )}
          <button
            onClick={onLogout}
            className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:from-fuchsia-500 hover:to-indigo-500"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>
  );
}
