import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listProductsR, manageProductR, productRDetail } from "./api";

export interface State {
  productsR: any[];
  productRDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  productsR: [],
  productRDetail: {},
  total: 0,
  extra: {},
};

export const fetchProductsR = createAsyncThunk(
  "productsR/fetchProductsR",
  async (data: any) => {
    const response = await listProductsR(data);
    return response;
  }
);

export const getproductRDetail = createAsyncThunk(
  "productsR/getproductRDetail",
  async (data: any) => {
    const response = await productRDetail(data);
    return response;
  }
);

export const getmanageProductR = createAsyncThunk(
  "productsR/getmanageProductR",
  async (data: any) => {
    const response = await manageProductR(data);
    return response;
  }
);



export const reducerSlice = createSlice({
  name: "productsR",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsR.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.productsR = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getproductRDetail.fulfilled, (state, action) => {
        state.productRDetail = action.payload?.message
      })
  },
});

export const selectProductsR = (state: AppState) =>
  state.productsR?.productsR;
export const selectProductR = (state: AppState) => state.productsR?.productRDetail;
export const selectTotal = (state: AppState) => state.productsR?.total;;
export const selectExtra = (state: AppState) => state.productsR?.extra;

export default reducerSlice.reducer;
