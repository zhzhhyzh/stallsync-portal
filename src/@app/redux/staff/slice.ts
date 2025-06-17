import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listStaffs,manageStaff,staffDetail,removeStaff } from "./api";

export interface State {
  staffs: any[];
  staffDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  staffs: [],
  staffDetail: {},
  total: 0,
  extra: {},
};

export const fetchstaffs = createAsyncThunk(
  "staffs/fetchstaffs",
  async (data: any) => {
    const response = await listStaffs(data);
    return response;
  }
);

export const getstaffDetail = createAsyncThunk(
  "staffs/getstaffDetail",
  async (data: any) => {
    const response = await staffDetail(data);
    return response;
  }
);

export const getmanageStaff = createAsyncThunk(
  "staffs/getmanageStaff",
  async (data: any) => {
    const response = await manageStaff(data);
    return response;
  }
);

export const getremoveStaff = createAsyncThunk(
  "staffs/getremoveStaff",
  async (data: any) => {
    const response = await removeStaff(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchstaffs.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.staffs = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getstaffDetail.fulfilled, (state, action) => {
        state.staffDetail = action.payload?.message
      })
  },
});

export const selectStaffs = (state: AppState) =>
  state.staffs?.staffs;
export const selectStaff = (state: AppState) => state.staffs?.staffDetail;
export const selectTotal = (state: AppState) => state.staffs?.total;;
export const selectExtra = (state: AppState) => state.staffs?.extra;

export default reducerSlice.reducer;
