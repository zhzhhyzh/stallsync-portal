import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listFeeCodes, manageFeeCode, feeCodeDetail, removeFeeCode } from "./api";

export interface State {
  feeCodes: any[];
  feeCodeDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  feeCodes: [],
  feeCodeDetail: {},
  total: 0,
  extra: {},
};

export const fetchFeeCodes = createAsyncThunk(
  "feeCodes/fetchFeeCodes",
  async (data: any) => {
    const response = await listFeeCodes(data);
    return response;
  }
);

export const getFeeCodeDetail = createAsyncThunk(
  "feeCodes/getFeeCodeDetail",
  async (data: any) => {
    const response = await feeCodeDetail(data);
    return response;
  }
);

export const getManageFeeCode = createAsyncThunk(
  "feeCodes/getManageFeeCode",
  async (data: any) => {
    const response = await manageFeeCode(data);
    return response;
  }
);

export const getRemoveFeeCode = createAsyncThunk(
  "feeCodes/getRemoveFeeCode",
  async (data: any) => {
    const response = await removeFeeCode(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "feeCodes",
  initialState,
  reducers: {
    setResetFeeCodeDetail: (state) => {
      state.feeCodeDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeCodes.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.feeCodes = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getFeeCodeDetail.fulfilled, (state, action) => {
        state.feeCodeDetail = action.payload?.message
      })
  },
});

export const selectFeeCodes = (state: AppState) =>
  state.feeCode?.feeCodes;
export const selectFeeCode = (state: AppState) => state.feeCode?.feeCodeDetail;
export const selectTotal = (state: AppState) => state.feeCode?.total;;
export const selectExtra = (state: AppState) => state.feeCode?.extra;
export const {setResetFeeCodeDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
