import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: (data) => {
        console.log("Data being sent to the API:", data);
        return {
          url: "admin/admin-login",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admin"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "admin/admin-sent-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "admin/admin-verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "admin/admin-reset-password",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: localStorage.getItem("resetToken"),
        },
      }),

      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useLogInMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
