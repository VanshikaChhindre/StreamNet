import { BsBuildingFill } from "react-icons/bs";
import { apiSlice } from "../../app/api/apiSlice";
import { checkLike } from "../../../../server/src/controllers/like.controller";

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

        getUserById: builder.query({
          query: (userId) => `/api/v1/users/u/${userId}`
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
        }),

        userTweets : builder.query({
          query: (userId) => `/api/v1/tweets/tweet/${userId}`,
        }),

        allTweets : builder.query({
          query: () => `/api/v1/tweets/all-tweets`,
        }),

        addComment : builder.mutation({
          query: (formData) => ({
            url: `/api/v1/comments/add-comment`,
            method: 'POST',
            body: formData
          }),
         
        }),

        videoComments : builder.query({
          query: (id) => `/api/v1/comments/video-comments/${id}`,
        }),

        addVideoLike : builder.mutation({
          query: (videoId) => ({
            url: `/api/v1/likes/like-video/${videoId}`,
            method: 'POST',
          }),
        }),

        checkVideoLike : builder.query({
          query: (id) => `/api/v1/likes/check-video-like/${id}`
        }),

        totalVideoLikes : builder.query({
          query: (id) => `/api/v1/likes/total-video-likes/${id}`
        }),

        toggleSubscription : builder.mutation({
          query: (channelId) => ({
            url: `/api/v1/subscription/toggle-subscription/${channelId}`,
            method: 'POST',
          }),
        }),

        checkUserSubscribed : builder.query({
          query : (channelId) => `/api/v1/subscription/check-user-subscribed/${channelId}`
        }),

        createPlaylist : builder.mutation({
          query: (formData) => ({
            url: `/api/v1/playlists/create-playlist`,
            method: 'POST',
            body: formData
          }),
        }),

        addVideoToPlaylist : builder.mutation({
          query: (playlistId, videoId) => ({
            url: `/api/v1/playlists/add-video-to-playlist/${playlistId}/${videoId}`,
            method: 'POST',
          }),
        }),

        getUserPlaylists : builder.query({
          query : (userId) => `/api/v1/playlists/user-playlists/${userId}`
        }),
       
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
  useGetUserByIdQuery,
  useUserChannelQuery,
  useUserVideosQuery,
  useAddVideoToHistoryMutation,
  useWatchHistoryQuery,
  useUpdateDetailsMutation,
  useCreateTweetMutation,
  useUserTweetsQuery,
  useAllTweetsQuery,
  useAddCommentMutation,
  useVideoCommentsQuery,
  useAddVideoLikeMutation,
  useCheckVideoLikeQuery,
  useTotalVideoLikesQuery,
  useToggleSubscriptionMutation,
  useCheckUserSubscribedQuery,
  useCreatePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useGetUserPlaylistsQuery

} = authApiSlice;

