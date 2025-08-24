"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login } from "@/slices/authSlice";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { LoginFormValues } from "@/types/authTypes";

const validationSchema = Yup.object({
  email: Yup.string().email("Geçerli bir e-mail girin").required("Zorunlu"),
  password: Yup.string().min(6, "En az 6 karakter").required("Zorunlu"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const router = useRouter();

  const initialValues: LoginFormValues = { email: "", password: "" };

  const onSubmit = async (values: LoginFormValues) => {
    const user = await dispatch(login(values));
    // if ((user as any).meta.requestStatus === "fulfilled") router.push("/");
    if (login.fulfilled.match(user)) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6a5cff] via-[#7a4df3] to-[#ff4db1] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1.25fr_1fr] rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
          <div className="h-full w-full bg-[radial-gradient(1200px_600px_at_-10%_20%,rgba(255,255,255,.18),transparent_60%)] p-12 flex flex-col justify-center text-white">
            <h2 className="text-5xl font-extrabold leading-tight drop-shadow-sm">
              Welcome to <br /> your trip!
            </h2>
            <p className="mt-6 max-w-md text-white/90">
              We brought an innovation to the modern ticketing application
            </p>

            <div className="mt-10 flex gap-3">
              <span className="h-2 w-20 rounded-full bg-white/70" />
              <span className="h-2 w-12 rounded-full bg-white/50" />
              <span className="h-2 w-8 rounded-full bg-white/30" />
            </div>

            <p className="mt-auto text-xs text-white/70">
              © {new Date().getFullYear()} Ticket App
            </p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <div className="max-w-sm mx-auto">
            <h1 className="text-2xl font-extrabold text-gray-900">
              USER LOGIN
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Don’t have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-fuchsia-600 hover:underline"
              >
                Create Account
              </button>
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              validateOnBlur
              validateOnChange={false}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="mt-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Email
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
                        placeholder="user@example.com"
                        className="ml-2 w-full outline-none text-gray-500"
                        autoComplete="email"
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
                      Password
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
                        placeholder="••••••••"
                        className="ml-2 w-full outline-none text-gray-500"
                        autoComplete="current-password"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-xs text-red-600 mt-1"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="h-11 w-full rounded-xl text-white font-semibold shadow transition
                               bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500
                               disabled:opacity-50"
                  >
                    {loading || isSubmitting ? "Logging in…" : "Login "}
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
