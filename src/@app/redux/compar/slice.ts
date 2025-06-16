import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listCompars,manageCompar,comparDetail,removeCompar } from "./api";

export interface State {
  compars: any[];
  comparDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  compars: [],
  comparDetail: {},
  total: 0,
  extra: {},
};

export const fetchCompar = createAsyncThunk(
  "compars/fetchCompar",
  async (data: any) => {
    const response = await listCompars(data);
    return response;
  }
);

export const getComparDetail = createAsyncThunk(
  "compars/getComparDetail",
  async (data: any) => {
    const response = await comparDetail(data);
    return response;
  }
);

export const getManageCompar = createAsyncThunk(
  "compars/getManageCompar",
  async (data: any) => {
    const response = await manageCompar(data);
    return response;
  }
);

export const getremoveCompar = createAsyncThunk(
  "compars/getremoveCompar",
  async (data: any) => {
    const response = await removeCompar(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "compars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompar.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.compars = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getComparDetail.fulfilled, (state, action) => {
        state.comparDetail = action.payload?.message
      })
  },
});

export const selectcompars = (state: AppState) =>
  state.compars?.compars;
export const selectCompar = (state: AppState) => state.compars?.comparDetail;
export const selectTotal = (state: AppState) => state.compars?.total;;
export const selectExtra = (state: AppState) => state.compars?.extra;

export default reducerSlice.reducer;
