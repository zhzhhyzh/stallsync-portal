import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { detailPushParam, maintainPushParam } from "./api";

export interface State {
 pushParamDetail: any;
}

const initialState: State = {
  pushParamDetail: {},
};

export const fetchPushParamDetail = createAsyncThunk(
  "pshpar/fetchPushParamDetail",
  async () => {
    const response = await detailPushParam();
    return response;
  }
);

export const managePushParam = createAsyncThunk(
  "pshpar/managePushParam",
  async (data: any) => {
    const response = await maintainPushParam(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "Push Notification Parameter",
  initialState,
  reducers: {
    setResetPushNotiParamDetail: (state) => {
      state.pushParamDetail = {};
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPushParamDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.pushParamDetail = action.payload?.message;
        }
      });
  },
});
export const { setResetPushNotiParamDetail } =
  reducerSlice.actions;


export const selectPushNotiParam = (state: AppState) =>
  state.pushParam?.pushParamDetail;

export default reducerSlice.reducer;
