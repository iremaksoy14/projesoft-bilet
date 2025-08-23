// app/register/page.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterForm } from "./schema";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { register as registerUser } from "@/slices/authSlice";
import { useRouter } from "next/navigation";
import Select from "@/components/Select";
import DatePicker from "@/components/DatePicker";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: null as any,
      birthDate: undefined,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    const payload = {
      ...data,
      birthDate: data.birthDate.toISOString().slice(0, 10),
    } as any;
    const act = await dispatch(registerUser(payload));
    if ((act as any).meta.requestStatus === "fulfilled") router.push("/login");
  };

  const birthDate = watch("birthDate");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">Kayıt Ol</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ad</label>
              <input
                {...register("firstName")}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Soyad</label>
              <input
                {...register("lastName")}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parola</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="En az 8 karakter, 1 büyük/küçük harf ve 1 rakam"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Cinsiyet</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v)}
                    options={[
                      { label: "Kadın", value: "F" },
                      { label: "Erkek", value: "M" },
                    ]}
                    placeholder="Seçin"
                  />
                )}
              />
              {errors.gender && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* BirthDate */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Doğum Tarihi
              </label>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={birthDate}
                    onChange={(d) => field.onChange(d)}
                  />
                )}
              />
              {errors.birthDate && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Kaydediliyor…" : "Kayıt Ol"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Zaten hesabın var mı?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-indigo-600 hover:underline"
          >
            Giriş yap
          </button>
        </p>
      </div>
    </div>
  );
}
