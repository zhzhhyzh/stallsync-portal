import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listProdCom,manageProdCom,prodComDetail,removeProdCom } from "./api";

export interface State {
  prodComs: any[];
  prodComDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  prodComs: [],
  prodComDetail: {},
  total: 0,
  extra: {},
};

export const fetchProdCom = createAsyncThunk(
  "prodComs/fetchProdCom",
  async (data: any) => {
    const response = await listProdCom(data);
    return response;
  }
);

export const getprodComDetail = createAsyncThunk(
  "prodComs/getprodComDetail",
  async (data: any) => {
    const response = await prodComDetail(data);
    return response;
  }
);

export const getmanageProdCom = createAsyncThunk(
  "prodComs/getmanageProdCom",
  async (data: any) => {
    const response = await manageProdCom(data);
    return response;
  }
);

export const getremoveProdCom = createAsyncThunk(
  "prodComs/getremoveProdCom",
  async (data: any) => {
    const response = await removeProdCom(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "product Commission",
  initialState,
  reducers: {
    setResetprodComDetail:(state)=>{
      state.prodComDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProdCom.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.prodComs = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getprodComDetail.fulfilled, (state, action) => {
        state.prodComDetail = action.payload?.message
      })
  },
});

export const selectProdComs = (state: AppState) =>
  state.prodCom?.prodComs;
export const selectProdCom = (state: AppState) => state.prodCom?.prodComDetail;
export const selectTotal = (state: AppState) => state.prodCom?.total;
export const selectExtra = (state: AppState) => state.prodCom?.extra;
export const {setResetprodComDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
