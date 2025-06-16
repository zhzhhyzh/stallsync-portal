import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
// import { manageNotificationGroup, notificationGroupDetail, notificationGroupList, removeNotificationGroup } from "./api";
import { manageNotificationGroupData, notificationGroupDataDetail, notificationGroupDataList, removeNotificationGroupData } from "./api";

export interface State {
  notificationGroupDataList: any[]; //list
  notificationGroupDataTotal: number;
  notificationGroupDataDetail: any;
  extra: any;
}

const initialState: State = {
  notificationGroupDataList: [],
  notificationGroupDataTotal: 0,
  notificationGroupDataDetail: {},
  extra: {},
};

export const getNotificationGroupDataList = createAsyncThunk(
  "notificationGroupData/getNotificationGroupDataList",
  async (data: any) => {
    const response = await notificationGroupDataList(data);
    return response;
  }
);

export const getNotificationGroupDataDetail = createAsyncThunk(
  "notificationGroupData/getNotificationGroupDataDetail",
  async (data: any) => {
    const response = await notificationGroupDataDetail(data);
    return response;
  }
);

export const getManageNotificationGroupData = createAsyncThunk(
  "notificationGroupData/getManageNotificationGroupData",
  async (data: any) => {
    const response = await manageNotificationGroupData(data);
    return response;
  }
);

export const getRemoveNotificationGroupData = createAsyncThunk(
  "notificationGroupData/getRemoveNotificationGroupData",
  async (data: any) => {
    const response = await removeNotificationGroupData(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "notificationGroupData",
  initialState,
  reducers: {
    setResetNotificationGroupDataDetail: (state) => {
      state.notificationGroupDataDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationGroupDataList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationGroupDataList = action.payload?.message?.data;
          state.notificationGroupDataTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getNotificationGroupDataDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationGroupDataDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetNotificationGroupDataDetail } =
  reducerSlice.actions;

export const selectNotificationGroupDatas = (state: AppState) =>
  state.notificationGroupData?.notificationGroupDataList;
export const selectNotificationGroupDataTotal = (state: AppState) =>
  state.notificationGroupData?.notificationGroupDataTotal;
export const selectNotificationGroupData = (state: AppState) =>
  state.notificationGroupData?.notificationGroupDataDetail;
export const selectExtra = (state: AppState) => state.notificationGroupData?.extra;

export default reducerSlice.reducer;
