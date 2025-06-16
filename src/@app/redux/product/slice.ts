import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { productList, productQueueLink, productQueueUnlink } from "./api";

export interface State {
  products: any[];
  productsTotal: number;
  extra: any;
}

const initialState: State = {
  products: [],
  productsTotal: 0,
  extra: {},
};

export const fetchProductList = createAsyncThunk(
  "queueProductWorkgroup/fetchProductList",
  async (data: any) => {
    const response = await productList(data);
    return response;
  }
);


export const linkProductQueue = createAsyncThunk(
  "queueProductWorkgroup/linkProductQueue",
  async (data: any) => {
    const response = await productQueueLink(data);
    return response;
  }
);

export const unlinkProductQueue = createAsyncThunk(
  "queueProductWorkgroup/unlinkProductQueue",
  async (data: any) => {
    const response = await productQueueUnlink(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "queueProductWorkgroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.products = action.payload?.message?.data;
          state.productsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
  },
});

export const selectProducts = (state: AppState) =>
  state.product?.products;
export const selectProductsTotal = (state: AppState) =>
  state.product?.productsTotal;
export const selectExtra = (state: AppState) => state.product?.extra;

export default reducerSlice.reducer;