import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { testReceiverTest, testReceiverAdd, testReceiverDelete, testReceiverList, testReceiverDetail, testReceiverUpdate } from "./api";

export interface State {
  testReceivers: any[];
  total: number;
  testReceiverDetail: any;
  extra: any;
}

const initialState: State = {
  testReceivers: [],
  total: 0,
  testReceiverDetail: {},
  extra: {},
};

export const list = createAsyncThunk(
  "testReceivers/list",
  async (data: any) => {
    const response = await testReceiverList(data);
    return response;
  }
);

export const detail = createAsyncThunk(
  "testReceivers/detail",
  async (data: any) => {
    const response = await testReceiverDetail(data);
    return response;
  }
);

export const add = createAsyncThunk(
  "testReceivers/add",
  async (data: any) => {
    const response = await testReceiverAdd(data);
    return response;
  }
);

export const update = createAsyncThunk(
  "testReceivers/update",
  async (data: any) => {
    const response = await testReceiverUpdate(data);
    return response;
  }
);

export const remove = createAsyncThunk(
  "testReceivers/remove",
  async (data: any) => {
    const response = await testReceiverDelete(data);
    return response;
  }
);
export const test = createAsyncThunk(
  "testReceivers/test",
  async (data: any) => {
    const response = await testReceiverTest(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "testReceivers",
  initialState,
  reducers: {
    setResetTestReceiverDetail: (state) => {
      state.testReceiverDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(list.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.testReceivers = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(detail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.testReceiverDetail = action.payload?.message;
        }
      })
  },
});

export const { setResetTestReceiverDetail } =
  reducerSlice.actions;

export const selectTestReceivers = (state: AppState) =>
  state.testReceiver.testReceivers;
export const selectTestReceiverDetail = (state: AppState) =>
  state.testReceiver.testReceiverDetail;
export const selectTotal = (state: AppState) =>
  state.testReceiver?.total;
export const selectExtra = (state: AppState) => state.testReceiver?.extra;

export default reducerSlice.reducer;
