import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listAgent,manageAgent,agentDetail,removeAgent } from "./api";

export interface State {
  agents: any[];
  agentDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  agents: [],
  agentDetail: {},
  total: 0,
  extra: {},
};

export const fetchAgent = createAsyncThunk(
  "agents/fetchAgent",
  async (data: any) => {
    const response = await listAgent(data);
    return response;
  }
);

export const getagentDetail = createAsyncThunk(
  "agents/getagentDetail",
  async (data: any) => {
    const response = await agentDetail(data);
    return response;
  }
);

export const getmanageAgent = createAsyncThunk(
  "agents/getmanageAgent",
  async (data: any) => {
    const response = await manageAgent(data);
    return response;
  }
);

export const getremoveAgent = createAsyncThunk(
  "agents/getremoveAgent",
  async (data: any) => {
    const response = await removeAgent(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "Agent Incentive",
  initialState,
  reducers: {
    setResetagentDetail:(state)=>{
      state.agentDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgent.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.agents = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getagentDetail.fulfilled, (state, action) => {
        state.agentDetail = action.payload?.message
      })
  },
});

export const selectagents = (state: AppState) =>
  state.agent?.agents;
export const selectagent = (state: AppState) => state.agent?.agentDetail;
export const selectTotal = (state: AppState) => state.agent?.total;
export const selectExtra = (state: AppState) => state.agent?.extra;
export const {setResetagentDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
