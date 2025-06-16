import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { manageNotificationSubscription, notificationSubscriptionDetail, notificationSubscriptionList, removeNotificationSubscription } from "./api";

export interface State {
  notificationSubsList: any[]; //list
  notificationSubsTotal: number;
  notificationSubsDetail: any;
  extra: any;
}

const initialState: State = {
  notificationSubsList: [],
  notificationSubsTotal: 0,
  notificationSubsDetail: {},
  extra: {},
};

export const getNotificationSubsList = createAsyncThunk(
  "notificationSubscription/getNotificationSubsList",
  async (data: any) => {
    const response = await notificationSubscriptionList(data);
    return response;
  }
);

export const getNotificationSubsDetail = createAsyncThunk(
  "notificationSubscription/getNotificationSubsDetail",
  async (data: any) => {
    const response = await notificationSubscriptionDetail(data);
    return response;
  }
);

export const getManageNotificationSubs = createAsyncThunk(
  "notificationSubscription/getManageNotificationSubs",
  async (data: any) => {
    const response = await manageNotificationSubscription(data);
    return response;
  }
);

export const getRemoveNotificationSubs = createAsyncThunk(
  "notificationSubscription/getRemoveNotificationSubs",
  async (data: any) => {
    const response = await removeNotificationSubscription(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "notificationSubscription",
  initialState,
  reducers: {
    setResetNotificationSubsDetail: (state) => {
      state.notificationSubsDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationSubsList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationSubsList = action.payload?.message?.data;
          state.notificationSubsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getNotificationSubsDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationSubsDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetNotificationSubsDetail } =
  reducerSlice.actions;

export const selectNotificationSubs = (state: AppState) =>
  state.notificationSubs?.notificationSubsList;
export const selectNotificationSubsTotal = (state: AppState) =>
  state.notificationSubs?.notificationSubsTotal;
export const selectNotificationSubscription = (state: AppState) =>
  state.notificationSubs?.notificationSubsDetail;
export const selectExtra = (state: AppState) => state.notificationSubs?.extra;

export default reducerSlice.reducer;
