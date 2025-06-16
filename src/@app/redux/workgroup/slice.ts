import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { workgroupDetail, workgroupList, deleteWorkgroup, manageWorkgroup } from "./api";

export interface State {
  workgroups: any[];
  workgroupsTotal: number;
  workgroupsDetail: any;
  extra: any;
}

const initialState: State = {
  workgroups: [],
  workgroupsTotal: 0,
  workgroupsDetail: {},
  extra: {},
};

export const fetchWorkgroupList = createAsyncThunk(
  "workgroups/fetchWorkgroupList",
  async (data: any) => {
    const response = await workgroupList(data);
    return response;
  }
);

export const fetchWorkgroupDetail = createAsyncThunk(
  "workgroups/fetchWorkgroupDetail",
  async (data: any) => {
    const response = await workgroupDetail(data);
    return response;
  }
);

export const getManageWorkgroup = createAsyncThunk(
  "workgroups/getManageWorkgroup",
  async (data: any) => {
    const response = await manageWorkgroup(data);
    return response;
  }
);

export const getRemoveWorkgroup = createAsyncThunk(
  "workgroups/getRemoveWorkgroup",
  async (data: any) => {
    const response = await deleteWorkgroup(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "workgroups",
  initialState,
  reducers: {
    setResetWorkgroupDetail: (state) => {
      state.workgroupsDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkgroupList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.workgroups = action.payload?.message?.data;
          state.workgroupsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchWorkgroupDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.workgroupsDetail = action.payload?.message;
        }
      });
  },
});

export const selectWorkgroups = (state: AppState) =>
  state.workgroup?.workgroups;
export const selectWorkgroupTotal = (state: AppState) =>
  state.workgroup?.workgroupsTotal;
export const selectWorkgroup = (state: AppState) =>
  state.workgroup?.workgroupsDetail; //detail
export const selectExtra = (state: AppState) => state.workgroup?.extra;

export default reducerSlice.reducer;
export const { setResetWorkgroupDetail } = reducerSlice.actions;
