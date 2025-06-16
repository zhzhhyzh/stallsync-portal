import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listDsagent,manageDsagent,dsagentDetail,removeDsagent } from "./api";

export interface State {
  dsagents: any[];
  dsagentDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  dsagents: [],
  dsagentDetail: {},
  total: 0,
  extra: {},
};

export const fetchDsagent = createAsyncThunk(
  "dsagents/fetchDsagent",
  async (data: any) => {
    const response = await listDsagent(data);
    return response;
  }
);

export const getdsagentDetail = createAsyncThunk(
  "dsagents/getdsagentDetail",
  async (data: any) => {
    const response = await dsagentDetail(data);
    return response;
  }
);

export const getmanageDsagent = createAsyncThunk(
  "dsagents/getmanageDsagent",
  async (data: any) => {
    const response = await manageDsagent(data);
    return response;
  }
);

export const getremoveDsagent = createAsyncThunk(
  "dsagents/getremoveDsagent",
  async (data: any) => {
    const response = await removeDsagent(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "product Commission",
  initialState,
  reducers: {
    setResetdsagentDetail:(state)=>{
      state.dsagentDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDsagent.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.dsagents = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getdsagentDetail.fulfilled, (state, action) => {
        state.dsagentDetail = action.payload?.message
      })
  },
});

export const selectdsagents = (state: AppState) =>
  state.dsagent?.dsagents;
export const selectdsagent = (state: AppState) => state.dsagent?.dsagentDetail;
export const selectTotal = (state: AppState) => state.dsagent?.total;
export const selectExtra = (state: AppState) => state.dsagent?.extra;
export const {setResetdsagentDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
