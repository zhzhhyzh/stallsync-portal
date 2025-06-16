import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listPappar, managePappar, papparDetail, removePappar } from "./api";

export interface State {
  pappar: any[];
  papparDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  pappar: [],
  papparDetail: {},
  total: 0,
  extra: {},
};

export const fetchPappar = createAsyncThunk(
  "Pappar/fetchPappar",
  async (data: any) => {
    const response = await listPappar(data);
    return response;
  }
);

export const getPapparDetail = createAsyncThunk(
  "Pappar/getPapparDetail",
  async (data: any) => {
    const response = await papparDetail(data);
    return response;
  }
);

export const getManagePappar = createAsyncThunk(
  "Pappar/getManagePappar",
  async (data: any) => {
    const response = await managePappar(data);
    return response;
  }
);

export const getRemovePappar = createAsyncThunk(
  "Pappar/getRemovePappar",
  async (data: any) => {
    const response = await removePappar(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "Pappar",
  initialState,
  reducers: {
    setResetPapparDetail: (state) => {
      state.papparDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPappar.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.pappar = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getPapparDetail.fulfilled, (state, action) => {
        state.papparDetail = action.payload?.message
      })
  },
});

export const selectPappars = (state: AppState) =>
  state.pappar?.pappar;
export const selectPapparTotal = (state: AppState) => state.pappar?.total;
export const selectPappar = (state: AppState) => state.pappar?.papparDetail;
export const selectExtra = (state: AppState) => state.pappar?.extra;
export const { setResetPapparDetail } = reducerSlice.actions;
export default reducerSlice.reducer;
