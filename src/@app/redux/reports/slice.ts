import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { downloadReport, generateReport, listReport, forecast, fetchForecastDetail } from "./api";

export interface State {
  reports: any[];
  reportsTotal: number;

  extra: any;

  order: any[];
  sales: any[];

}

const initialState: State = {
  reports: [],
  reportsTotal: 0,
  extra: {},

  order: [],
  sales: [],


};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (data: any) => {
    const response = await listReport(data);
    return response;
  }
);

export const fetchForecastView = createAsyncThunk(
  "reports/fetchForecastView",
  async (data: any) => {
    const response = await fetchForecastDetail(data);
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

export const fetchForecast = createAsyncThunk(
  "reports/fetchForecast",
  async (data: any) => {
    const response = await forecast(data);
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
      .addCase(fetchForecastView.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sales = action.payload?.message?.sales;
          state.order = action.payload?.message?.order;
        }
      })
  },
});

export const selectReports = (state: AppState) =>
  state.reports?.reports;
export const selectOrders = (state: AppState) =>
  state.reports?.order;
export const selectSales = (state: AppState) =>
  state.reports?.sales;
export const selectReportsTotal = (state: AppState) =>
  state.reports?.reportsTotal;


export const selectExtra = (state: AppState) => state.reports?.extra;

export default reducerSlice.reducer;
