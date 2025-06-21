import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listProducts, manageProduct, productDetail, removeProduct } from "./api";

export interface State {
  products: any[];
  productDetail: any;
  total: number;
  extra: any;
  headerInfo: any;
}

const initialState: State = {
  products: [],
  productDetail: {},
  total: 0,
  extra: {},
  headerInfo: {}
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (data: any) => {
    const response = await listProducts(data);
    return response;
  }
);

export const getproductDetail = createAsyncThunk(
  "products/getproductDetail",
  async (data: any) => {
    const response = await productDetail(data);
    return response;
  }
);

export const getmanageProduct = createAsyncThunk(
  "products/getmanageProduct",
  async (data: any) => {
    const response = await manageProduct(data);
    return response;
  }
);

export const getremoveProduct = createAsyncThunk(
  "products/getremoveProduct",
  async (data: any) => {
    const response = await removeProduct(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.products = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
          state.headerInfo = action.payload?.message?.headerInfo;
        }
      })
      .addCase(getproductDetail.fulfilled, (state, action) => {
        state.productDetail = action.payload?.message
      })
  },
});

export const selectProducts = (state: AppState) =>
  state.products?.products;
export const selectProduct = (state: AppState) => state.products?.productDetail;
export const selectTotal = (state: AppState) => state.products?.total;;
export const selectExtra = (state: AppState) => state.products?.extra;
export const selectHeader = (state: AppState) => state.products?.headerInfo;

export default reducerSlice.reducer;
