import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: true,
  user: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userLogIn: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    userLogOut: (state) => {

      state.isLoading = false;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const getUser = async () => {
  try {
    const option = {
      url: "http://localhost:3000/api/v1/user/loadUser",
      method: "GET",
      withCredentials: true,
    };
    const userData = await axios(option);
    return userData;
  } catch (error) {
    console.log(error);
    const { data } = error.response;
    return data;
  }
};

export const { userLogIn, userLogOut } = userSlice.actions;
