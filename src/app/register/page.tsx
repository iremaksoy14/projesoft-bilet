"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { register as registerUser } from "@/slices/authSlice";
import { useRouter } from "next/navigation";
import Select from "@/components/Select";
import DatePicker from "@/components/DatePicker";
import type { RegisterForm } from "../../types/authTypes";
import { genders } from "@/data";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const RegisterSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "Ad en az 2 karakter")
    .required("Zorunlu"),
  lastName: Yup.string()
    .trim()
    .min(2, "Soyad en az 2 karakter")
    .required("Zorunlu"),
  email: Yup.string().trim().email("Geçerli bir e-mail").required("Zorunlu"),
  password: Yup.string()
    .min(8, "En az 8 karakter")
    .matches(/[A-Z]/, "1 büyük harf")
    .matches(/[a-z]/, "1 küçük harf")
    .matches(/\d/, "1 rakam")
    .required("Zorunlu"),
  gender: Yup.mixed<"M" | "F">()
    .oneOf(["M", "F"], "Cinsiyet zorunlu")
    .required("Cinsiyet zorunlu"),
  birthDate: Yup.date()
    .typeError("Doğum tarihi zorunlu")
    .required("Doğum tarihi zorunlu"),
});

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const initialValues: RegisterForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: null,
    birthDate: null,
  };

  const onSubmit = async (values: RegisterForm) => {
    const payload = {
      ...values,
      birthDate: values.birthDate
        ? values.birthDate.toISOString().slice(0, 10)
        : "",
    } as any;
    const act = await dispatch(registerUser(payload));
    if ((act as any).meta.requestStatus === "fulfilled") router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6a5cff] via-[#7a4df3] to-[#ff4db1] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1.25fr_1fr] rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_20%,rgba(255,255,255,.18),transparent_60%)]" />
          <div className="h-full w-full p-12 flex flex-col justify-center text-white">
            <h2 className="text-5xl font-extrabold leading-tight drop-shadow-sm">
              Create your <br /> account ✨
            </h2>
            <p className="mt-6 max-w-md text-white/90">
              Yeni Nesil Bilet Uygulaması
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/80" /> Hızlı
                hesap oluşturma özelliği eklendi
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/80" /> Cinsiyete
                göre duyarlılık eklendi
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/80" /> Mock API
                ile hızlı veri özelliği eklendi
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/80" /> Çoklu dil
                seçeneği için dosyalar eklendi
              </li>
            </ul>
            <p className="mt-auto text-xs text-white/70">
              © {new Date().getFullYear()} Ticket App
            </p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Zaten hesabın var mı?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-fuchsia-600 hover:underline"
              >
                Giriş yap
              </button>
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={onSubmit}
              validateOnBlur
              validateOnChange={false}
            >
              {({ isSubmitting, values, setFieldValue, touched, errors }) => (
                <Form className="mt-6 grid gap-5">
                  {/* Name-Surname */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Ad
                      </label>
                      <div
                        className={`flex items-center rounded-xl border px-3 h-11 focus-within:ring-2 ${
                          touched.firstName && errors.firstName
                            ? "border-red-400 ring-red-400/60"
                            : "border-gray-300 ring-fuchsia-500/60"
                        }`}
                      >
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <Field
                          name="firstName"
                          className="ml-2 w-full outline-none"
                        />
                      </div>
                      <ErrorMessage
                        name="firstName"
                        component="p"
                        className="text-xs text-red-600 mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Soyad
                      </label>
                      <div
                        className={`flex items-center rounded-xl border px-3 h-11 focus-within:ring-2 ${
                          touched.lastName && errors.lastName
                            ? "border-red-400 ring-red-400/60"
                            : "border-gray-300 ring-fuchsia-500/60"
                        }`}
                      >
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <Field
                          name="lastName"
                          className="ml-2 w-full outline-none"
                        />
                      </div>
                      <ErrorMessage
                        name="lastName"
                        component="p"
                        className="text-xs text-red-600 mt-1"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      E-mail
                    </label>
                    <div
                      className={`flex items-center rounded-xl border px-3 h-11 focus-within:ring-2 ${
                        touched.email && errors.email
                          ? "border-red-400 ring-red-400/60"
                          : "border-gray-300 ring-fuchsia-500/60"
                      }`}
                    >
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <Field
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="ml-2 w-full outline-none"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-xs text-red-600 mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Parola
                    </label>
                    <div
                      className={`flex items-center rounded-xl border px-3 h-11 focus-within:ring-2 ${
                        touched.password && errors.password
                          ? "border-red-400 ring-red-400/60"
                          : "border-gray-300 ring-fuchsia-500/60"
                      }`}
                    >
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      <Field
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="En az 8 karakter, 1 büyük/küçük harf ve 1 rakam"
                        className="ml-2 w-full outline-none"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-xs text-red-600 mt-1"
                    />
                  </div>

                  {/* Gender  */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Cinsiyet
                      </label>
                      <Select
                        value={values.gender}
                        onChange={(v) => setFieldValue("gender", v)}
                        options={genders}
                        placeholder="Seçin"
                      />
                      {touched.gender && errors.gender && (
                        <p className="text-xs text-red-600 mt-1">
                          {String(errors.gender)}
                        </p>
                      )}
                    </div>
                    {/* Birthdate  */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Doğum Tarihi
                      </label>
                      <DatePicker
                        value={values.birthDate ?? undefined}
                        onChange={(d) => setFieldValue("birthDate", d)}
                      />
                      {touched.birthDate && errors.birthDate && (
                        <p className="text-xs text-red-600 mt-1">
                          {String(errors.birthDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="h-11 w-full rounded-xl text-white font-semibold shadow transition
                               bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500
                               disabled:opacity-50"
                  >
                    {loading || isSubmitting ? "Kaydediliyor…" : "Kayıt Ol"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
