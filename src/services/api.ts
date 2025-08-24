import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../lib/baseUrl";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}/` }),
  tagTypes: ["Trips", "Cities", "Auth"],
  endpoints: () => ({}),
});
