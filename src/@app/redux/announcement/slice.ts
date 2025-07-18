import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listAnnouncement, listAnnouncement2, manageAnnouncement, detailAnnouncement, removeAnnouncement } from "./api";

export interface State {
  announcements: any[];
  announcements2: any[];
  total: number;
  total2: number;
  announcement: any;
  extra: any;
  extra2: any;
}

const initialState: State = {
  announcements: [],
  announcements2: [],
  total: 0,
  total2: 0,
  announcement: {},
  extra: {},
  extra2: {},
};

export const list = createAsyncThunk(
  "announcement/list",
  async (data: any) => {
    const response = await listAnnouncement(data);
    return response;
  }
);
export const list2 = createAsyncThunk(
  "announcement/list2",
  async (data: any) => {
    const response = await listAnnouncement2(data);
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

      .addCase(list2.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.announcements2 = action.payload?.message?.data;
          state.total2 = action.payload?.message?.total2 || 10;
          state.extra2 = action.payload?.message?.extra2;
        }
      })
      .addCase(detail.fulfilled, (state, action) => {
        state.announcement = action.payload?.message
      })

  },
});

export const selectAnnouncements = (state: AppState) =>
  state.announcement.announcements;

export const selectAnnouncements2 = (state: AppState) =>
  state.announcement.announcements2;
export const selectAnnouncement = (state: AppState) =>
  state.announcement.announcement;
export const selectTotal = (state: AppState) =>
  state.announcement?.total;
export const selectTotal2 = (state: AppState) =>
  state.announcement?.total2;
export const selectExtra = (state: AppState) => state.announcement?.extra;
export const selectExtra2 = (state: AppState) => state.announcement?.extra2;

export default reducerSlice.reducer;
