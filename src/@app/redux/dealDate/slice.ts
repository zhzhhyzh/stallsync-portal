import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listDealDate,manageDealDate, dealDateDetail, removeDealDate } from "./api";

export interface State {
  dealDate: any[];
  dealDateDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  dealDate: [],
  dealDateDetail: {},
  total: 0,
  extra: {},
};

export const fetchDealDate = createAsyncThunk(
  "dealDate/fetchDealDate",
  async (data: any) => {
    const response = await listDealDate(data);
    return response;
  }
);

export const getDealDateDetail = createAsyncThunk(
  "dealDate/getDealDateDetail",
  async (data: any) => {
    const response = await dealDateDetail(data);
    return response;
  }
);

export const getManageDealDate = createAsyncThunk(
  "dealDate/getManageDealDate",
  async (data: any) => {
    const response = await manageDealDate(data);
    return response;
  }
);

export const getRemoveDealDate = createAsyncThunk(
  "dealDate/getRemoveDealDate",
  async (data: any) => {
    const response = await removeDealDate(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "product Commission",
  initialState,
  reducers: {
    setResetdealDateDetail:(state)=>{
      state.dealDateDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealDate.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.dealDate = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getDealDateDetail.fulfilled, (state, action) => {
        state.dealDateDetail = action.payload?.message
      })
  },
});

export const selectDealDates = (state: AppState) =>
  state.dealDate?.dealDate;
export const selectDealDate = (state: AppState) => state.dealDate?.dealDateDetail;
export const selectTotal = (state: AppState) => state.dealDate?.total;
export const selectExtra = (state: AppState) => state.dealDate?.extra;
export const {setResetdealDateDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
