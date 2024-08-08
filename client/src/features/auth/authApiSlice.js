import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
          query: (credentials) => ({
            url: '/api/v1/users/register',
            method: 'POST',
            body: {...credentials},
           
          }),
        }),
        login: builder.mutation({
          query: (credentials) => ({
            url: '/api/v1/users/login',
            method: 'POST',
            body: { ...credentials }
          }),
        }),
      }),
    });
    


export const { useSignupMutation, useLoginMutation } = authApiSlice;

