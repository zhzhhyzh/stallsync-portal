import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { commissionListing, groupCommissionListing, personalCommissionListing } from "./api";

export interface State {
    gc: any[]; //list
    gcTotal: number;
    pc: any[]; //list
    pcTotal: number;
    commission:any[];
    total:number;
    extra: any;
}

const initialState: State = {
    gc: [],
    gcTotal: 0,
    pc: [],
    pcTotal: 0,
    commission:[],
    total:0,
  extra:{},
};

export const getCom = createAsyncThunk(
  "commission/getCom",
  async (data: any) => {
    const response = await commissionListing(data);
    return response;
  }
);
export const getGroupCom = createAsyncThunk(
  "commission/getGroupCom",
  async (data: any) => {
    const response = await groupCommissionListing(data);
    return response;
  }
);

export const getPersonalCom = createAsyncThunk(
  "commission/getPersonalCom",
  async (data: any) => {
    const response = await personalCommissionListing(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPersonalCom.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.pc = action.payload?.message?.data;
          state.pcTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getGroupCom.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.gc = action.payload?.message?.data;
          state.gcTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getCom.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.commission = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      });
  },
});

export const {  } =
  reducerSlice.actions;

export const selectCommissions =  (state: AppState) =>
  state.commission?.commission;
export const selectGcs = (state: AppState) =>
  state.commission?.gc;
export const selectGcsTotal = (state: AppState) =>
  state.commission?.gcTotal;
export const selectPcs = (state: AppState) =>
  state.commission?.pc;
export const selectPcsTotal = (state: AppState) =>
  state.commission?.pcTotal;
export const selectTotal = (state: AppState) =>
  state.commission?.total;

export const selectExtra = (state: AppState) => state.commission?.extra;
export default reducerSlice.reducer;
