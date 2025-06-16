import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listAnnouncement, manageAnnouncement, detailAnnouncement, removeAnnouncement } from "./api";

export interface State {
  announcements: any[];
  total: number;
  announcement: any;
  extra: any;
}

const initialState: State = {
  announcements: [],
  total: 0,
  announcement: {},
  extra: {},
};

export const list = createAsyncThunk(
  "announcement/list",
  async (data: any) => {
    const response = await listAnnouncement(data);
    return response;
  }
);

export const manage = createAsyncThunk(
  "announcement/manage",
  async (data: any) => {
    const response = await manageAnnouncement(data);
    return response;
  }
);

export const getremoveAnnouncement = createAsyncThunk(
  "announcement/removeAnnouncement",
  async (data: any) => {
    const response = await removeAnnouncement(data);
    return response;
  }
);
export const detail = createAsyncThunk(
  "announcement/detail",
  async (data: any) => {
    const response = await detailAnnouncement(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(list.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.announcements = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(detail.fulfilled, (state, action) => {
        state.announcement = action.payload?.message
    })
  
  },
});

export const selectAnnouncements = (state: AppState) =>
  state.announcement.announcements;
export const selectAnnouncement = (state: AppState) =>
  state.announcement.announcement;
export const selectTotal = (state: AppState) =>
  state.announcement?.total;
export const selectExtra = (state: AppState) => state.announcement?.extra;

export default reducerSlice.reducer;
