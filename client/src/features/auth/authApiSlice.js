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

        logout: builder.mutation({
          query: ()=>({
            url: '/api/v1/users/logout',
            method: 'POST'
          })
        }),

        upload: builder.mutation({
          query: (formData) => ({
            url: '/api/v1/videos/uploadvideo',
            method: 'POST',
            body: formData
          })
        })
      }),
    });
    


export const { useSignupMutation, useLoginMutation, useLogoutMutation, useUploadMutation } = authApiSlice;

