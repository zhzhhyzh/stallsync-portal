import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listGlas,manageGla,glaDetail,removeGla } from "./api";

export interface State {
  glas: any[];
  glaDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  glas: [],
  glaDetail: {},
  total: 0,
  extra: {},
};

export const fetchGlas = createAsyncThunk(
  "glas/fetchGlas",
  async (data: any) => {
    const response = await listGlas(data);
    return response;
  }
);

export const getGlaDetail = createAsyncThunk(
  "glas/getGlaDetail",
  async (data: any) => {
    const response = await glaDetail(data);
    return response;
  }
);

export const getManageGla = createAsyncThunk(
  "glas/getManageGla",
  async (data: any) => {
    const response = await manageGla(data);
    return response;
  }
);

export const getRemoveGla = createAsyncThunk(
  "glas/getRemoveGla",
  async (data: any) => {
    const response = await removeGla(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "glas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlas.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.glas = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getGlaDetail.fulfilled, (state, action) => {
        state.glaDetail = action.payload?.message
      })
  },
});

export const selectGlas = (state: AppState) =>
  state.glas?.glas;
export const selectGla = (state: AppState) => state.glas?.glaDetail;
export const selectTotal = (state: AppState) => state.glas?.total;;
export const selectExtra = (state: AppState) => state.glas?.extra;

export default reducerSlice.reducer;
