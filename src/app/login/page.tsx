// app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login } from "@/slices/authSlice";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Geçerli bir e-mail girin"),
  password: z.string().min(6, "En az 6 karakter"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormValues) => {
    const act = await dispatch(login(data));
    if ((act as any).meta.requestStatus === "fulfilled") router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Giriş Yap</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
                ${
                  errors.email
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              placeholder="ornek@email.com"
            />
            {errors.email && (
              <p className="text-xs mt-1 text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Parola</label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
                ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs mt-1 text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Hesabın yok mu?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-indigo-600 hover:underline"
          >
            Kayıt ol
          </button>
        </p>
      </div>
    </div>
  );
}
