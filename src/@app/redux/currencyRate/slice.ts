import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listCurrat,manageCurrat,curratDetail,removeCurrat } from "./api";

export interface State {
  currat: any[];
  curratDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  currat: [],
  curratDetail: {},
  total: 0,
  extra: {},
};

export const fetchCurrat = createAsyncThunk(
  "currat/fetchCurrat",
  async (data: any) => {
    const response = await listCurrat(data);
    return response;
  }
);

export const getCurratDetail = createAsyncThunk(
  "currat/getCurratDetail",
  async (data: any) => {
    const response = await curratDetail(data);
    return response;
  }
);

export const getManageCurrat = createAsyncThunk(
  "currat/getManageCurrat",
  async (data: any) => {
    const response = await manageCurrat(data);
    return response;
  }
);

export const getRemoveCurrat = createAsyncThunk(
  "currat/getRemoveCurrat",
  async (data: any) => {
    const response = await removeCurrat(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "product Commission",
  initialState,
  reducers: {
    setResetcurratDetail:(state)=>{
      state.curratDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrat.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.currat = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getCurratDetail.fulfilled, (state, action) => {
        state.curratDetail = action.payload?.message
      })
  },
});

export const selectCurrats = (state: AppState) =>
  state.currat?.currat;
export const selectCurrat = (state: AppState) => state.currat?.curratDetail;
export const selectTotal = (state: AppState) => state.currat?.total;
export const selectExtra = (state: AppState) => state.currat?.extra;
export const {setResetcurratDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
