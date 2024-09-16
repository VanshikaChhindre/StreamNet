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

        getUser: builder.query({
          query: ()=> 'api/v1/users/current-user'
        }),

        upload: builder.mutation({
          query: (formData) => ({
            url: '/api/v1/videos/uploadvideo',
            method: 'POST',
            body: formData
          })
        }),

        allvideos: builder.query({
          query: () => '/api/v1/videos/allvideos',
        }),

        getVideoById: builder.query({
          query: (id) => `/api/v1/videos/getvideo/${id}`,
        }),

        getVideoById: builder.query({
          query: (id) => `/api/v1/videos/getvideo/${id}`,
        }),

        userChannel: builder.query({
          query: (username) => `/api/v1/users/c/${username}`,
        }),

        userVideos: builder.query({
          query: (userId) => `/api/v1/videos/allvideos/${userId}`,
        }),

        addVideoToHistory: builder.mutation({
          query: (videoId) => ({
            url: `/api/v1/users/watch/${videoId}`,
            method: 'POST',
          })
        }),

        watchHistory: builder.query({
          query: () => '/api/v1/users/history'
        }),

        updateDetails: builder.mutation({
          query: (details) => ({
            url: '/api/v1/users/update-account',
            method: 'PATCH',
            body: { ...details}
          }),
        }),

        createTweet : builder.mutation({
          query: (formData) => ({
            url: `/api/v1/tweets/add-tweet`,
            method: 'POST',
            body: formData
          })
        })
       
      }),
    });
    


export const { 
  useSignupMutation, 
  useLoginMutation, 
  useLogoutMutation,
  useGetUserQuery, 
  useUploadMutation, 
  useAllvideosQuery,
  useGetVideoByIdQuery,
  useUserChannelQuery,
  useUserVideosQuery,
  useAddVideoToHistoryMutation,
  useWatchHistoryQuery,
  useUpdateDetailsMutation,
  useCreateTweetMutation

} = authApiSlice;

