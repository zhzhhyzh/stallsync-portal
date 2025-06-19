import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listRewards,manageReward,rewardDetail,removeReward } from "./api";

export interface State {
  rewards: any[];
  rewardDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  rewards: [],
  rewardDetail: {},
  total: 0,
  extra: {},
};

export const fetchrewards = createAsyncThunk(
  "rewards/fetchrewards",
  async (data: any) => {
    const response = await listRewards(data);
    return response;
  }
);

export const getrewardDetail = createAsyncThunk(
  "rewards/getrewardDetail",
  async (data: any) => {
    const response = await rewardDetail(data);
    return response;
  }
);

export const getmanageReward = createAsyncThunk(
  "rewards/getmanageReward",
  async (data: any) => {
    const response = await manageReward(data);
    return response;
  }
);

export const getremoveReward = createAsyncThunk(
  "rewards/getremoveReward",
  async (data: any) => {
    const response = await removeReward(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchrewards.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.rewards = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getrewardDetail.fulfilled, (state, action) => {
        state.rewardDetail = action.payload?.message
      })
  },
});

export const selectrewards = (state: AppState) =>
  state.rewards?.rewards;
export const selectReward = (state: AppState) => state.rewards?.rewardDetail;
export const selectTotal = (state: AppState) => state.rewards?.total;;
export const selectExtra = (state: AppState) => state.rewards?.extra;

export default reducerSlice.reducer;
