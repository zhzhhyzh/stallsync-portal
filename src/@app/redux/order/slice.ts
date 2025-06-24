import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listOrders, manageOrder, orderDetail } from "./api";

export interface State {
  order: any[];
  orderDetail: any;
  total: number;
  extra: any;
  headerInfo: any;

}

const initialState: State = {
  order: [],
  orderDetail: {},
  total: 0,
  extra: {},
  headerInfo: {}

};

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (data: any) => {
    const response = await listOrders(data);
    return response;
  }
);

export const getorderDetail = createAsyncThunk(
  "order/getorderDetail",
  async (data: any) => {
    const response = await orderDetail(data);
    return response;
  }
);

export const getmanageOrder = createAsyncThunk(
  "order/getmanageOrder",
  async (data: any) => {
    const response = await manageOrder(data);
    return response;
  }
);

// export const getremoveProduct = createAsyncThunk(
//   "order/getremoveProduct",
//   async (data: any) => {
//     const response = await removeProduct(data);
//     return response;
//   }
// );

export const reducerSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.order = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
          state.headerInfo = action.payload?.message?.headerInfo;
        }
      })
      .addCase(getorderDetail.fulfilled, (state, action) => {
        state.orderDetail = action.payload?.message
      })
  },
});

export const selectOrders = (state: AppState) =>
  state.order?.order;
export const selectOrder = (state: AppState) => state.order?.orderDetail;
export const selectTotal = (state: AppState) => state.order?.total;;
export const selectExtra = (state: AppState) => state.order?.extra;
export const selectHeader = (state: AppState) => state.products?.headerInfo;

export default reducerSlice.reducer;
