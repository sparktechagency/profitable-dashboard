import { baseApi } from "./baseApi";

const admin = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: () => ({
        url: "admin/get-all-admin",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    deleteFaq: builder.mutation({
      query: ({ _id }) => ({
        url: `faq/delete-faq`,
        method: "DELETE",
        params: { faqId: _id },
      }),
      invalidatesTags: ["faq"],
    }),

     deleteAdmin: builder.mutation({
      query: ({ id }) => ({
        url: `admin/delete-admin/${id}`,
        method: "DELETE",
     
      }),
      invalidatesTags: ["admin"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `admin/block-admin/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["admin"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/create-new-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    updateAdmin: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `admin/edit-admin/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useCreateAdminMutation,
  useDeleteFaqMutation,
  useUpdateAdminMutation,
  useBlockUserMutation,
  useDeleteAdminMutation
} = admin;

export default admin;
