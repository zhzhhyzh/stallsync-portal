import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import {
  approveRequest,
  createRequest,
  detailRequest,
  listRequest,
} from "./api";

export interface State {
  requests: any[];
  requestTotal: number;
  requestDetail: any;
  requestExtra: any;

 
}

const initialState: State = {
  requests: [],
  requestTotal: 0,
  requestDetail: {},
  requestExtra: {},

  
};

export const fetchRequest = createAsyncThunk(
  "request/fetchRequest",
  async (data: any) => {
    const response = await listRequest(data);
    return response;
  }
);

export const fetchRequestDetail = createAsyncThunk(
  "request/fetchRequestDetail",
  async (data: any) => {
    const response = await detailRequest(data);
    return response;
  }
);
export const fetchApproveRequest= createAsyncThunk(
  "request/fetchApproveRequest",
  async (data: any) => {
    const response = await approveRequest(data);
    return response;
  }
);
export const fetchCreateRequest= createAsyncThunk(
  "request/fetchApproveRequest",
  async (data: any) => {
    const response = await createRequest(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setResetRequestDetail: (state) => {
      state.requestDetail = {};
    },
    // setResetRewardProfileDetail: (state) => {
    //   state.rewardProfileDetail = {};
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequest.fulfilled, (state, action) => {
        state.requests = action.payload?.message?.data;

        state.requestTotal = action.payload?.message?.total;
        state.requestExtra = action.payload?.message?.extra;
      })
      .addCase(fetchRequestDetail.fulfilled, (state, action) => {
        state.requestDetail = action.payload?.message;
      })
      
  },
});

export const { setResetRequestDetail } =
  reducerSlice.actions;

export const selectRequests = (state: AppState) =>
  state.request?.requests;
export const selectRequestTotal = (state: AppState) =>
  state.request?.requestTotal;
export const selectRequestDetail = (state: AppState) =>
  state.request?.requestDetail;
export const selectRequestExtra = (state: AppState) =>
  state.request?.requestExtra;

export default reducerSlice.reducer;
