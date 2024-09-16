import {createSlice} from '@reduxjs/toolkit'


const authSlice = createSlice({
    name: "auth",
    initialState: {user: null, token: null},
    reducers: {
        setCredentials: (state, action)=>{
            console.log(action.payload)
            const { user, token } = action.payload
            state.user = user;
            state.token = token;
        },
        updateUserDetails: (state, action) => {
            const { key, value } = action.payload;
            if (state.user) {
              state.user[key] = value; // Update the specific field in the user object
            }
        },
        logOut: (state, action) =>{
            state.user = null;
            state.token = null;
        }
    },
})

export const { setCredentials, updateUserDetails, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
