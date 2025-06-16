import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { channelCodeDetail, channelCodeList, manageChannelCode, removeChannelCode } from "./api";

export interface State {

  channelCodeList: any[]; //list
  channelCodeTotal: number;
  channelCodeDetail: any;
  extra: any;
}

const initialState: State = {
  channelCodeList: [],
  channelCodeTotal: 0,
  channelCodeDetail: {},
  extra: {},
};

export const getChannelCodeList = createAsyncThunk(
  "channelCode/getChannelCodeList",
  async (data: any) => {
    const response = await channelCodeList(data);
    return response;
  }
);

export const getChannelCodeDetail = createAsyncThunk(
  "channelCode/getChannelCodeDetail",
  async (data: any) => {
    const response = await channelCodeDetail(data);
    return response;
  }
);

export const getManageChannelCode = createAsyncThunk(
  "channelCode/getManageChannelCode",
  async (data: any) => {
    const response = await manageChannelCode(data);
    return response;
  }
);

export const getRemoveChannelCode = createAsyncThunk(
  "channelCode/getRemoveChannelCode",
  async (data: any) => {
    const response = await removeChannelCode(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "channelCode",
  initialState,
  reducers: {
    setResetChannelCodeDetail: (state) => {
      state.channelCodeDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChannelCodeList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.channelCodeList = action.payload?.message?.data;
          state.channelCodeTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getChannelCodeDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.channelCodeDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetChannelCodeDetail } =
  reducerSlice.actions;

export const selectChannelCodes = (state: AppState) =>
  state.channelCode?.channelCodeList;
export const selectChannelCodeTotal = (state: AppState) =>
  state.channelCode?.channelCodeTotal;
export const selectChannelCode = (state: AppState) =>
  state.channelCode?.channelCodeDetail;
export const selectExtra = (state: AppState) => state.channelCode?.extra;

export default reducerSlice.reducer;
