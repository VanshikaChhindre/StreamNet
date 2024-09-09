import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token
        if(token){
            headers.set("Authorization", `Bearer ${token}`)
        }else{
            console.log("token not found")
        }
        return headers
    }
})


const baseQueryWithReauth = async(args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.originalStatus === 401){
        console.log("sending refresh token")

        const refreshResult = await baseQuery({
            url: '/api/v1/users/refresh-token',
            method: 'POST' 
        }, api, extraOptions)
        if (refreshResult?.error?.originalStatus === 404) {
            console.log("Refresh token endpoint not found. Check your API route.");
        } else if (refreshResult?.error?.status === 'PARSING_ERROR') {
            console.log("Response is not JSON. Ensure the server returns JSON.");
            console.log(refreshResult.error); // Log the full error
        } else {
            console.log(refreshResult); // Log the successful response

            if (refreshResult?.data) {
                const user = api.getState().auth.user;
                // Store the new access token and refresh token
                api.dispatch(setCredentials({ ...refreshResult.data, user }));
                // Retry the original query with the new access token
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut()); // If refresh token fails, log the user out
            }
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})


/**so basically when cookies are used, the server maintains a session which include users credentials and generate a 
 session id while when jwt are used, the server just compares the token in header and provides access to data on the 
 basis of that. I am setting accesstoken and refreshtoken in my cookie, so the only thing cookie is doing is maintaining 
 my accesstoken and refreshtoken in server. i can send request using just cookies as they are automatically attached to
 requests, or I can explicitly use headers like I did above. The server will fetch the accesstoken from the cookie
or header compare it with the token stored in databse and provide data if they match.*/