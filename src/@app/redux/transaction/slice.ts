import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listTransactions, transactionDetail } from "./api";

export interface State {
  transaction: any[];
  transactionDetail: any;
  total: number;
  extra: any;

}

const initialState: State = {
  transaction: [],
  transactionDetail: {},
  total: 0,
  extra: {},

};

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (data: any) => {
    const response = await listTransactions(data);
    return response;
  }
);

export const getTransactionDetail = createAsyncThunk(
  "transaction/getTransactionDetail",
  async (data: any) => {
    const response = await transactionDetail(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.transaction = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getTransactionDetail.fulfilled, (state, action) => {
        state.transactionDetail = action.payload?.message
      })
  },
});

export const selecttransactions = (state: AppState) =>
  state.transactions?.transaction;
export const selecttransaction = (state: AppState) => state.transactions?.transactionDetail;
export const selectTotal = (state: AppState) => state.transactions?.total;;
export const selectExtra = (state: AppState) => state.transactions?.extra;

export default reducerSlice.reducer;
