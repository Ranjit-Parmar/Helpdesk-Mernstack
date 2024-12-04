import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoading : true,
    ticket : [],
}
export const ticketSlice = createSlice({
    name : 'ticketReducer',
    initialState,
    reducers : {
        fetchAllTickets : (state, action) => {
            state.isLoading = false;
            state.ticket = action.payload;
        }
    }
})


export const {fetchAllTickets} = ticketSlice.actions;