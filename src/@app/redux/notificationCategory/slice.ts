import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { 
  notificationCategoryList, 
  manageNotificationCategory, 
  notificationCategoryDetail,
  removeNotificationCategory 
} from "./api";

export interface State {

  notificationCategoryList: any[];
  notificationCategoryTotal: number;
  notificationCategoryDetail: any;
  extra: any;
}

const initialState: State = {

  notificationCategoryList: [],
  notificationCategoryTotal: 0,
  notificationCategoryDetail: {},
  extra: {},
};


export const getNotificationCategoryList = createAsyncThunk(
  "notificationCategory/getNotificationCategoryList",
  async (data: any) => {
    const response = await notificationCategoryList(data);
    return response;
  }
);

export const getNotificationCategoryDetail = createAsyncThunk(
  "notificationCategory/getNotificationCategoryDetail",
  async (data: any) => {
    const response = await notificationCategoryDetail(data);
    return response;
  }
);

export const getManageNotificationCategory = createAsyncThunk(
  "notificationCategory/getManageNotificationCategory",
  async (data: any) => {
    const response = await manageNotificationCategory(data);
    return response;
  }
);

export const getRemoveNotificationCategory = createAsyncThunk(
  "notificationCategory/getRemoveNotificationCategory",
  async (data: any) => {
    const response = await removeNotificationCategory(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "notificationCategory",
  initialState,
  reducers: {
    setResetNotificationCategoryDetail: (state) => {
      state.notificationCategoryDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationCategoryList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationCategoryList = action.payload?.message?.data;
          state.notificationCategoryTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getNotificationCategoryDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.notificationCategoryDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetNotificationCategoryDetail } =
  reducerSlice.actions;

export const selectNotificationCategories = (state: AppState) =>
  state.notificationCategory?.notificationCategoryList;
export const selectNotificationCategoryTotal = (state: AppState) =>
  state.notificationCategory?.notificationCategoryTotal;
export const selectNotificationCategory = (state: AppState) =>
  state.notificationCategory?.notificationCategoryDetail;
export const selectExtra = (state: AppState) => state.notificationCategory?.extra;

export default reducerSlice.reducer;
