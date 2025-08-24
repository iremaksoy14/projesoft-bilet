import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // desteklenen diller
  locales: ["tr", "en"],
  defaultLocale: "tr", // varsayılan
  localePrefix: "always", // URL: /tr, /en ...
});

// public dosyalar ve next içi rotaları hariç tut
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
