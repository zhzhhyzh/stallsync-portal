import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { detailPasswordPolicy, updatePasswordPolicy } from "./api";

export interface State {
  passwordPolicyDetail: any;
  extra: any;

}

const initialState: State = {
  passwordPolicyDetail: {},
  extra: {},

};

export const fetchPasswordPolicyDetail = createAsyncThunk(
  "passwordPolicy/fetchAdminDetail",
  async () => {
    const response = await detailPasswordPolicy();
    return response;
  }
);

export const managePasswordPolicy = createAsyncThunk(
  "passwordPolicy/manage",
  async (data: any) => {
    const response = await updatePasswordPolicy(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "passwordPolicy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPasswordPolicyDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.passwordPolicyDetail = action.payload?.message;
          state.extra = action.payload?.message;
        }
      });
  },
});

export const selectPasswordPolicy = (state: AppState) =>
  state.passwordPolicy?.passwordPolicyDetail;
export const selectExtra = (state: AppState) => 
  state.passwordPolicy?.extra;

export default reducerSlice.reducer;
