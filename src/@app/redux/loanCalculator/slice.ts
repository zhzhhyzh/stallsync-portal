import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { calculateLoan } from "./api";

export interface State {
  loan_info: any;
}

const initialState: State = {
  loan_info: {},
};

export const calculate = createAsyncThunk(
  "loancalculator/calculate",
  async (data: any) => {
    const response = await calculateLoan(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "loancalculator",
  initialState,
  reducers: {
    setResetLoanInfo: (state) => {
      state.loan_info = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculate.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.loan_info = action.payload?.message;
        }
      })
  },
});

export const { setResetLoanInfo } =
  reducerSlice.actions;

export const selectLoanInfo = (state: AppState) =>
  state.loancalculator?.loan_info;

export default reducerSlice.reducer;