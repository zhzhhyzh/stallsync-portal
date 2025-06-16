import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import {
  changePassword,
  user,
  userUpdate,
} from "./api";

export interface State {
  profile: any;
}

const initialState: State = {
  profile: {},
};

export const fetchUserProfile = createAsyncThunk(
  "app/fetchUserProfile",
  async () => {
    const response = await user();
    return response;
  }
);

export const updateUserProfile = createAsyncThunk(
  "app/updateUserProfile",
  async (data: any) => {
    const response = await userUpdate(data);
    return response;
  }
);

export const changeUserPassword = createAsyncThunk(
  "app/changeUserPassword",
  async (data: any) => {
    const response = await changePassword(data);
    return response;
  }
);


export const reducerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.profile = action.payload;
        }
      })
  },
});

export const selectProfile = (state: AppState) => state.user?.profile;

export default reducerSlice.reducer;
