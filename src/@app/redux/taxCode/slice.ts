import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listTaxCodes,manageTaxCode,taxCodeDetail,removeTaxCode } from "./api";

export interface State {
  taxCodes: any[];
  taxCodeDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  taxCodes: [],
  taxCodeDetail: {},
  total: 0,
  extra: {},
};

export const fetchTaxCodes = createAsyncThunk(
  "taxCodes/fetchTaxCodes",
  async (data: any) => {
    const response = await listTaxCodes(data);
    return response;
  }
);

export const getTaxCodeDetail = createAsyncThunk(
  "taxCodes/getTaxCodeDetail",
  async (data: any) => {
    const response = await taxCodeDetail(data);
    return response;
  }
);

export const getManageTaxCode = createAsyncThunk(
  "taxCodes/getManageTaxCode",
  async (data: any) => {
    const response = await manageTaxCode(data);
    return response;
  }
);

export const getRemoveTaxCode = createAsyncThunk(
  "taxCodes/getRemoveTaxCode",
  async (data: any) => {
    const response = await removeTaxCode(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "taxCodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxCodes.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.taxCodes = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getTaxCodeDetail.fulfilled, (state, action) => {
        state.taxCodeDetail = action.payload?.message
      })
  },
});

export const selectTaxCodes = (state: AppState) =>
  state.taxCodes?.taxCodes;
export const selectTaxCode = (state: AppState) => state.taxCodes?.taxCodeDetail;
export const selectTotal = (state: AppState) => state.taxCodes?.total;;
export const selectExtra = (state: AppState) => state.taxCodes?.extra;

export default reducerSlice.reducer;
