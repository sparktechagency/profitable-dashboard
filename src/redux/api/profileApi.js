import { baseApi } from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "admin/get-admin-detail",
        method: "GET",
    
      }),
      providesTags: ["profile"],
    }),
    updateProfile: builder.mutation({
      query: (file) => ({
        url: "admin/edit-admin-detail",
        method: "PATCH",
        body: file,
      }),
      invalidatesTags: ["profile"],
    }),
    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "admin/admin-change-password",
        method: "PATCH",
        body: data,
      }),
    }),
    getUserDetails: builder.query({
      query: (params) => ({
        url: "user/user-detail",
        method: "GET",
        params,
      }),
      providesTags: ["profile"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangeAdminPasswordMutation,
  useGetUserProfileQuery,
  useGetUserDetailsQuery,
} = profileApi;
