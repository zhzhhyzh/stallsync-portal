import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listProdCodes,manageProdCode,prodCodeDetail,removeProdCode } from "./api";

export interface State {
  prodCodes: any[];
  prodCodeDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  prodCodes: [],
  prodCodeDetail: {},
  total: 0,
  extra: {},
};

export const fetchProdCodes = createAsyncThunk(
  "prodCodes/fetchProdCodes",
  async (data: any) => {
    const response = await listProdCodes(data);
    return response;
  }
);

export const getProdCodeDetail = createAsyncThunk(
  "prodCodes/getProdCodeDetail",
  async (data: any) => {
    const response = await prodCodeDetail(data);
    return response;
  }
);

export const getManageProdCode = createAsyncThunk(
  "prodCodes/getManageProdCode",
  async (data: any) => {
    const response = await manageProdCode(data);
    return response;
  }
);

export const getRemoveProdCode = createAsyncThunk(
  "prodCodes/getRemoveProdCode",
  async (data: any) => {
    const response = await removeProdCode(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "productCodes",
  initialState,
  reducers: {
    setResetProdCodeDetail:(state)=>{
      state.prodCodeDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProdCodes.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.prodCodes = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getProdCodeDetail.fulfilled, (state, action) => {
        state.prodCodeDetail = action.payload?.message
      })
  },
});

export const selectProdCodes = (state: AppState) =>
  state.prodCodes?.prodCodes;
export const selectProdCode = (state: AppState) => state.prodCodes?.prodCodeDetail;
export const selectTotal = (state: AppState) => state.prodCodes?.total;;
export const selectExtra = (state: AppState) => state.prodCodes?.extra;
export const {setResetProdCodeDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
