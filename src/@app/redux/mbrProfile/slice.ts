import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listMbrs, manageMbr, mbrDetail, removeMbr } from "./api";

export interface State {
  mbrs: any[];
  mbrDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  mbrs: [],
  mbrDetail: {},
  total: 0,
  extra: {},
};

export const fetchmbrs = createAsyncThunk(
  "mbrs/fetchmbrs",
  async (data: any) => {
    const response = await listMbrs(data);
    return response;
  }
);

export const getmbrDetail = createAsyncThunk(
  "mbrs/getmbrDetail",
  async (data: any) => {
    const response = await mbrDetail(data);
    return response;
  }
);

export const getmanageMbr = createAsyncThunk(
  "mbrs/getmanageMbr",
  async (data: any) => {
    const response = await manageMbr(data);
    return response;
  }
);

export const getremoveMbr = createAsyncThunk(
  "mbrs/getremoveMbr",
  async (data: any) => {
    const response = await removeMbr(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "mbrs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchmbrs.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.mbrs = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getmbrDetail.fulfilled, (state, action) => {
        state.mbrDetail = action.payload?.message
      })
  },
});

export const selectMbrs = (state: AppState) =>
  state.mbrs?.mbrs;
export const selectMbr = (state: AppState) => state.mbrs?.mbrDetail;
export const selectTotal = (state: AppState) => state.mbrs?.total;;
export const selectExtra = (state: AppState) => state.mbrs?.extra;

export default reducerSlice.reducer;
