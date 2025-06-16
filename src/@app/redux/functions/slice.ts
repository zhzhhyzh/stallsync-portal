import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { addUpdateFunctions, detailFunctions, listFunctions, removeFunctions } from "./api";

export interface State {
  functions: any[];
  functionsTotal: number;
  functionsDetail: any;
  extra: any;
}

const initialState: State = {
  functions: [],
  functionsTotal: 0,
  functionsDetail: {},
  extra: {},
};

export const fetchFunctions = createAsyncThunk(
  "functions/fetchFunctions",
  async (data: any) => {
    const response = await listFunctions(data);
    return response;
  }
);

export const fetchFunctionsDetail = createAsyncThunk(
  "functions/fetchFunctionsDetail",
  async (data: any) => {
    const response = await detailFunctions(data);
    return response;
  }
);

export const manageFunctions = createAsyncThunk(
  "functions/manageFunctions",
  async (data: any) => {
    const response = await addUpdateFunctions(data);
    return response;
  }
);

export const deleteAdmin = createAsyncThunk(
  "functions/deleteAdmin",
  async (data: any) => {
    const response = await removeFunctions(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "functions",
  initialState,
  reducers: {
    setResetFunctionsDetail: (state) => {
      state.functionsDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunctions.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.functions = action.payload?.message?.data;
          state.functionsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchFunctionsDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.functionsDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetFunctionsDetail } =
  reducerSlice.actions;

export const selectFunctions = (state: AppState) =>
  state.functions?.functions;
export const selectFunctionsTotal = (state: AppState) =>
  state.functions?.functionsTotal;
export const selectFunction = (state: AppState) =>
  state.functions?.functionsDetail;
export const selectExtra = (state: AppState) => state.functions?.extra;

export default reducerSlice.reducer;