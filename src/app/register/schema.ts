// // app/register/schema.ts
// import { z } from "zod";
// export const registerSchema = z.object({
//   firstName: z.string().min(2, "Ad en az 2 karakter"),
//   lastName: z.string().min(2, "Soyad en az 2 karakter"),
//   email: z.string().email("Geçerli bir e-mail"),
//   password: z
//     .string()
//     .min(8, "En az 8 karakter")
//     .regex(/[A-Z]/, "1 büyük harf")
//     .regex(/[a-z]/, "1 küçük harf")
//     .regex(/\d/, "1 rakam"),
//   gender: z.enum(["M", "F"], { required_error: "Cinsiyet zorunlu" }),
//   birthDate: z.date({ required_error: "Doğum tarihi zorunlu" }),
// });
// export type RegisterForm = z.infer<typeof registerSchema>;

// app/register/schema.ts
import { z } from "zod";

/**
 * Yardımcı: string veya Date gelen değeri Date'e çevir.
 * - input type="date" → "2025-08-25" gelir → Date'e çevrilir
 * - boş değer → undefined kalsın (required_error tetiklenir)
 */
const toDate = (val: unknown) => {
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  if (typeof val === "string") {
    const s = val.trim();
    if (!s) return undefined;
    const d = new Date(s);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

/**
 * Yardımcı: cinsiyeti güvenceye al (string ise trim+uppercase)
 */
const toGender = (val: unknown) => {
  if (typeof val !== "string") return undefined;
  const g = val.trim().toUpperCase();
  return g === "M" || g === "F" ? g : undefined;
};

export const registerSchema = z.object({
  firstName: z
    .string()
    .transform((s) => s.trim())
    .min(2, "Ad en az 2 karakter"),
  lastName: z
    .string()
    .transform((s) => s.trim())
    .min(2, "Soyad en az 2 karakter"),
  email: z
    .string()
    .transform((s) => s.trim())
    .email("Geçerli bir e-mail"),
  password: z
    .string()
    .min(8, "En az 8 karakter")
    .regex(/[A-Z]/, "1 büyük harf")
    .regex(/[a-z]/, "1 küçük harf")
    .regex(/\d/, "1 rakam"),
  gender: z.preprocess(
    toGender,
    z.enum(["M", "F"], { required_error: "Cinsiyet zorunlu" })
  ),
  birthDate: z.preprocess(
    toDate,
    z.date({ required_error: "Doğum tarihi zorunlu" })
  ),
});

export type RegisterForm = z.infer<typeof registerSchema>;
