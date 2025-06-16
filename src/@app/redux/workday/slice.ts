import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listWorkDay,manageWorkDay,workDayDetail,removeWorkDay } from "./api";

export interface State {
  workDays: any[];
  workDayDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  workDays: [],
  workDayDetail: {},
  total: 0,
  extra: {},
};

export const fetchworkday = createAsyncThunk(
  "workDays/fetchworkday",
  async (data: any) => {
    const response = await listWorkDay(data);
    return response;
  }
);

export const getworkDayDetail = createAsyncThunk(
  "workDays/getworkDayDetail",
  async (data: any) => {
    const response = await workDayDetail(data);
    return response;
  }
);

export const getmanageWorkDay = createAsyncThunk(
  "workDays/getmanageWorkDay",
  async (data: any) => {
    const response = await manageWorkDay(data);
    return response;
  }
);

export const getremoveWorkDay = createAsyncThunk(
  "workDays/getremoveWorkDay",
  async (data: any) => {
    const response = await removeWorkDay(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "WorkDay",
  initialState,
  reducers: {
    setResetworkDayDetail:(state)=>{
      state.workDayDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchworkday.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.workDays = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getworkDayDetail.fulfilled, (state, action) => {
        state.workDayDetail = action.payload?.message
      })
  },
});

export const selectworkDays = (state: AppState) =>
  state.workday?.workDays;
export const selectworkday = (state: AppState) => state.workday?.workDayDetail;
export const selectTotal = (state: AppState) => state.workday?.total;
export const selectExtra = (state: AppState) => state.workday?.extra;
export const {setResetworkDayDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
