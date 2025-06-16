import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { downloadReport, generateReport, generateRewardReport,listReport, listReward } from "./api";

export interface State {
  reports: any[];
  reportsTotal: number;

  extra: any;

  rewards: any[];
  rewardsTotal: number;
  extraR: any;
}

const initialState: State = {
  reports: [],
  reportsTotal: 0,
  extra: {},

  rewards: [],
  rewardsTotal: 0,
  extraR: {},

};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (data: any) => {
    const response = await listReport(data);
    return response;
  }
);

export const fetchRewards = createAsyncThunk(
  "reports/fetchRewards",
  async (data: any) => {
    const response = await listReward(data);
    return response;
  }
);

export const fetchDownloadReport = createAsyncThunk(
  "reports/fetchDownloadReport",
  async (data: any) => {
    const response = await downloadReport(data);
    return response;
  }
);

export const fetchGenerateReport = createAsyncThunk(
  "reports/fetchGenerateReport",
  async (data: any) => {
    const response = await generateReport(data);
    return response;
  }
);
export const fetchGenerateRewardReport = createAsyncThunk(
  "reports/fetchGenerateRewardReport",
  async (data: any) => {
    const response = await generateRewardReport(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.reports = action.payload?.message?.data;
          state.reportsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.rewards = action.payload?.message?.data;
          state.rewardsTotal = action.payload?.message?.total || 10;
          state.extraR = action.payload?.message?.extra;
        }
      })

  },
});

export const selectReports = (state: AppState) =>
  state.reports?.reports;
export const selectRewards = (state: AppState) =>
  state.rewards?.rewards;
export const selectReportsTotal = (state: AppState) =>
  state.reports?.reportsTotal;
export const selectRewardsTotal = (state: AppState) =>
  state.rewards?.rewardsTotal;

export const selectExtra = (state: AppState) => state.reports?.extra;
export const selectExtraR = (state: AppState) => state.rewards?.extraR;

export default reducerSlice.reducer;
