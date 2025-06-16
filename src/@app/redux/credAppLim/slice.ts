import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listCredAppLims,manageCredAppLim,credAppLimDetail,removeCredAppLim } from "./api";

export interface State {
  credAppLims: any[];
  credAppDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  credAppLims: [],
  credAppDetail: {},
  total: 0,
  extra: {},
};

export const fetchCredAppLims = createAsyncThunk(
  "credAppLims/fetchCredAppLims",
  async (data: any) => {
    const response = await listCredAppLims(data);
    return response;
  }
);

export const getCredAppLimDetail = createAsyncThunk(
  "credAppLims/getCredAppLimDetail",
  async (data: any) => {
    const response = await credAppLimDetail(data);
    return response;
  }
);

export const getManageCredAppLim = createAsyncThunk(
  "credAppLims/getManageCredAppLim",
  async (data: any) => {
    const response = await manageCredAppLim(data);
    return response;
  }
);

export const getRemoveCredAppLim = createAsyncThunk(
  "credAppLims/getRemoveCredAppLim",
  async (data: any) => {
    const response = await removeCredAppLim(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "credAppLims",
  initialState,
  // reducers: {},
  reducers: {
    setResetCredAppDetail:(state)=>{
      state.credAppDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredAppLims.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.credAppLims = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getCredAppLimDetail.fulfilled, (state, action) => {
        state.credAppDetail = action.payload?.message
      })
  },
});

export const selectCredAppLims = (state: AppState) =>
  state.credAppLims?.credAppLims;
export const selectCredAppLim = (state: AppState) => state.credAppLims?.credAppDetail;
export const selectTotal = (state: AppState) => state.credAppLims?.total;;
export const selectExtra = (state: AppState) => state.credAppLims?.extra;
export const {setResetCredAppDetail} = reducerSlice.actions;

export default reducerSlice.reducer;
