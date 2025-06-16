import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listTranCodes,manageTranCode,tranCodeDetail,removeTranCode } from "./api";

export interface State {
  tranCodes: any[];
  tranCodeDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  tranCodes: [],
  tranCodeDetail: {},
  total: 0,
  extra: {},
};

export const fetchTranCodes = createAsyncThunk(
  "tranCodes/fetchTranCodes",
  async (data: any) => {
    const response = await listTranCodes(data);
    return response;
  }
);

export const getTranCodeDetail = createAsyncThunk(
  "tranCodes/getTranCodeDetail",
  async (data: any) => {
    const response = await tranCodeDetail(data);
    return response;
  }
);

export const getManageTranCode = createAsyncThunk(
  "tranCodes/getManageTranCode",
  async (data: any) => {
    const response = await manageTranCode(data);
    return response;
  }
);

export const getRemoveTranCode = createAsyncThunk(
  "tranCodes/getRemoveTranCode",
  async (data: any) => {
    const response = await removeTranCode(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "tranCodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranCodes.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.tranCodes = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getTranCodeDetail.fulfilled, (state, action) => {
        state.tranCodeDetail = action.payload?.message
      })
  },
});

export const selectTranCodes = (state: AppState) =>
  state.tranCodes?.tranCodes;
export const selectTranCode = (state: AppState) => state.tranCodes?.tranCodeDetail;
export const selectTotal = (state: AppState) => state.tranCodes?.total;;
export const selectExtra = (state: AppState) => state.tranCodes?.extra;

export default reducerSlice.reducer;
