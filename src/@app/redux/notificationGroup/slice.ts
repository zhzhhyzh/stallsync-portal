import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { manageNotificationGroup, notificationGroupDetail, notificationGroupList, removeNotificationGroup } from "./api";

export interface State {
  notificationGroupList: any[]; //list
  notificationGroupTotal: number;
  notificationGroupDetail: any;
  extra: any;
}

const initialState: State = {
  notificationGroupList: [],
  notificationGroupTotal: 0,
  notificationGroupDetail: {},
  extra: {},
};

export const getNotificationGroupList = createAsyncThunk(
  "notificationGroup/getNotificationGroupList",
  async (data: any) => {
    const response = await notificationGroupList(data);
    return response;
  }
);

export const getNotificationGroupDetail = createAsyncThunk(
  "notificationGroup/getNotificationGroupDetail",
  async (data: any) => {
    const response = await notificationGroupDetail(data);
    return response;
  }
);

export const getManageNotificationGroup = createAsyncThunk(
  "notificationGroup/getManageNotificationGroup",
  async (data: any) => {
    const response = await manageNotificationGroup(data);
    return response;
  }
);

export const getRemoveNotificationGroup = createAsyncThunk(
  "notificationGroup/getRemoveNotificationGroup",
  async (data: any) => {
    const response = await removeNotificationGroup(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "notificationGroup",
  initialState,
  reducers: {
    setResetNotificationGroupDetail: (state) => {
      state.notificationGroupDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationGroupList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationGroupList = action.payload?.message?.data;
          state.notificationGroupTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getNotificationGroupDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationGroupDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetNotificationGroupDetail } =
  reducerSlice.actions;

export const selectNotificationGroups = (state: AppState) =>
  state.notificationGroup?.notificationGroupList;
export const selectNotificationGroupTotal = (state: AppState) =>
  state.notificationGroup?.notificationGroupTotal;
export const selectNotificationGroup = (state: AppState) =>
  state.notificationGroup?.notificationGroupDetail;
export const selectExtra = (state: AppState) => state.notificationGroup?.extra;

export default reducerSlice.reducer;
