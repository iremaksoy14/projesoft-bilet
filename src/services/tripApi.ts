import { api } from "./api";

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
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  busLayout: { rows: number; colsPerSide: number };
  occupiedSeats: OccupiedSeat[];
}

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
      providesTags: (r, e, id) => [{ type: "Trips", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCitiesQuery, useSearchTripsQuery, useGetTripByIdQuery } =
  tripApi;
