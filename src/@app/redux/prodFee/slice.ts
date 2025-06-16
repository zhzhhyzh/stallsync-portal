import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listProdFees, manageProdFee, prodFeeDetail, removeProdFee } from "./api";

export interface State {
  prodFees: any[];
  prodFeeDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  prodFees: [],
  prodFeeDetail: {},
  total: 0,
  extra: {},
};

export const fetchProdFees = createAsyncThunk(
  "prodFees/fetchProdFees",
  async (data: any) => {
    const response = await listProdFees(data);
    return response;
  }
);

export const getProdFeeDetail = createAsyncThunk(
  "prodFees/getProdFeeDetail",
  async (data: any) => {
    const response = await prodFeeDetail(data);
    return response;
  }
);

export const getManageProdFee = createAsyncThunk(
  "prodFees/getManageProdFee",
  async (data: any) => {
    const response = await manageProdFee(data);
    return response;
  }
);

export const getRemoveProdFee = createAsyncThunk(
  "prodFees/getRemoveProdFee",
  async (data: any) => {
    const response = await removeProdFee(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "prodFees",
  initialState,
  reducers: {
    setResetProdFeeDetail: (state) => {
      state.prodFeeDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProdFees.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.prodFees = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getProdFeeDetail.fulfilled, (state, action) => {
        state.prodFeeDetail = action.payload?.message
      })
  },
});

export const selectProdFees = (state: AppState) =>
  state.prodFees?.prodFees;
export const selectProdFee = (state: AppState) => state.prodFees?.prodFeeDetail;
export const selectTotal = (state: AppState) => state.prodFees?.total;;
export const selectExtra = (state: AppState) => state.prodFees?.extra;
export const {setResetProdFeeDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
