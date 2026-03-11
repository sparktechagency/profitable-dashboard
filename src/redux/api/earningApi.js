import { baseApi } from "./baseApi";

const earningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarning: builder.query({
      query: ({ year, page, searchText }) => ({
        url: "payment/get-all-payment",
        method: "GET",
        params: {
          year,
          page,
          searchText,
        },
      }),
      providesTags: ["earning"],
    }),
  }),
});

export const { useGetEarningQuery } = earningApi;

export default earningApi;
