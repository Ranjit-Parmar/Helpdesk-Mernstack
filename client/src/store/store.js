import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../redux/api/userApi";
import { ticketApi } from "../redux/api/ticketApi";
import { userSlice } from "../redux/reducers/userReducer";

export const store = configureStore({
    reducer : {
        [userApi.reducerPath]: userApi.reducer,
        [ticketApi.reducerPath]:ticketApi.reducer,
        [userSlice.name] : userSlice.reducer
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware,ticketApi.middleware),

})