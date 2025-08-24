// src/services/tripApi.ts
import { api } from "./api";
import type { FetchBaseQueryError, FetchArgs } from "@reduxjs/toolkit/query";

export interface City {
  id: number;
  name: string;
}
export interface OccupiedSeat {
  seatNo: string;
  gender: "M" | "F";
}
export interface Trip {
  id: number;
  fromCityId: number;
  toCityId: number;
  date: string;
  time: string;
  price: number;
  busLayout: { rows: number; colsPerSide: number };
  occupiedSeats: OccupiedSeat[];
}

export type ReserveSeatsArg = {
  tripId: number;
  seats: string[];
  gender: "M" | "F" | null;
};

export const tripApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCities: build.query<City[], void>({
      query: () => `cities`,
      providesTags: ["Cities"],
    }),

    searchTrips: build.query<
      Trip[],
      { fromCityId: number; toCityId: number; date: string }
    >({
      query: (p) => ({
        url: `trips`,
        params: {
          fromCityId: p.fromCityId,
          toCityId: p.toCityId,
          date: p.date,
        },
      }),
      providesTags: ["Trips"],
    }),

    getTripById: build.query<Trip, number>({
      query: (id) => `trips/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Trips", id }],
    }),

    reserveSeats: build.mutation<{ ok: true }, ReserveSeatsArg>({
      async queryFn(arg, _api, _extra, baseQuery) {
        const tripRes = await baseQuery<Trip>({ url: `/trips/${arg.tripId}` });
        if (tripRes.error) return { error: tripRes.error };
        const trip = tripRes.data;

        const taken = new Set((trip.occupiedSeats ?? []).map((s) => s.seatNo));
        const conflicts = arg.seats.filter((s) => taken.has(s));
        if (conflicts.length) {
          const conflictError: FetchBaseQueryError = {
            status: 409,
            data: { message: `Koltuk(lar) dolu: ${conflicts.join(", ")}` },
          };
          return { error: conflictError };
        }

        const gender: "M" | "F" = arg.gender ?? "M";
        const next: OccupiedSeat[] = [
          ...(trip.occupiedSeats ?? []),
          ...arg.seats.map((seatNo) => ({ seatNo, gender })),
        ];

        const patchRes = await baseQuery<Trip>({
          url: `/trips/${arg.tripId}`,
          method: "PATCH",
          body: { occupiedSeats: next },
        } as FetchArgs);
        if (patchRes.error) return { error: patchRes.error };

        return { data: { ok: true } };
      },

      invalidatesTags: (_r, _e, { tripId }) => [{ type: "Trips", id: tripId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCitiesQuery,
  useSearchTripsQuery,
  useGetTripByIdQuery,
  useReserveSeatsMutation,
} = tripApi;
