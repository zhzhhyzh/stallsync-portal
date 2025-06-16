import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listProd,manageProd,prodDetail,removeProd } from "./api";

export interface State {
  prods: any[];
  prodDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  prods: [],
  prodDetail: {},
  total: 0,
  extra: {},
};

export const fetchProd = createAsyncThunk(
  "prods/fetchProd",
  async (data: any) => {
    const response = await listProd(data);
    return response;
  }
);

export const getProdDetail = createAsyncThunk(
  "prods/getProdDetail",
  async (data: any) => {
    const response = await prodDetail(data);
    return response;
  }
);

export const getManageProd = createAsyncThunk(
  "prods/getManageProd",
  async (data: any) => {
    const response = await manageProd(data);
    return response;
  }
);

export const getRemoveProd = createAsyncThunk(
  "prods/getRemoveProd",
  async (data: any) => {
    const response = await removeProd(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setResetProdDetail:(state)=>{
      state.prodDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProd.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.prods = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getProdDetail.fulfilled, (state, action) => {
        state.prodDetail = action.payload?.message
      })
  },
});

export const selectProds = (state: AppState) =>
  state.prods?.prods;
export const selectProd = (state: AppState) => state.prods?.prodDetail;
export const selectTotal = (state: AppState) => state.prods?.total;
export const selectExtra = (state: AppState) => state.prods?.extra;
export const {setResetProdDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
