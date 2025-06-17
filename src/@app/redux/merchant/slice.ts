import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listMechants,manageMerchant,merchantDetail,removeMerchant } from "./api";

export interface State {
  merchants: any[];
  merchantDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  merchants: [],
  merchantDetail: {},
  total: 0,
  extra: {},
};

export const fetchmerchants = createAsyncThunk(
  "merchants/fetchmerchants",
  async (data: any) => {
    const response = await listMechants(data);
    return response;
  }
);

export const getmerchantDetail = createAsyncThunk(
  "merchants/getmerchantDetail",
  async (data: any) => {
    const response = await merchantDetail(data);
    return response;
  }
);

export const getmanageMerchant = createAsyncThunk(
  "merchants/getmanageMerchant",
  async (data: any) => {
    const response = await manageMerchant(data);
    return response;
  }
);

export const getremoveMerchant = createAsyncThunk(
  "merchants/getremoveMerchant",
  async (data: any) => {
    const response = await removeMerchant(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "merchants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchmerchants.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.merchants = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getmerchantDetail.fulfilled, (state, action) => {
        state.merchantDetail = action.payload?.message
      })
  },
});

export const selectMerchants = (state: AppState) =>
  state.merchants?.merchants;
export const selectMerchant = (state: AppState) => state.merchants?.merchantDetail;
export const selectTotal = (state: AppState) => state.merchants?.total;;
export const selectExtra = (state: AppState) => state.merchants?.extra;

export default reducerSlice.reducer;
