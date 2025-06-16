import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { downlinePromotion, promotionDetail, promotionList, promotionSales, recruitListing, updatePromotion } from "./api";

export interface State {
    promotion: any;
    recruits: any[]; //list
    promotions: any[]; //list
    dwPromotions: any[]; //list
    sales: any[]; //list
    total: number;
    extra: any;
}

const initialState: State = {
  recruits: [],
  promotion:{},
    promotions: [],
    dwPromotions:[],
    sales: [],
    total: 0,
    extra: {},
};

export const getPromotionList = createAsyncThunk(
  "promotion/getPromotionList",
  async (data: any) => {
    const response = await promotionList(data);
    return response;
  }
);
export const getSalesList = createAsyncThunk(
  "promotion/getSalesList",
  async (data: any) => {
    const response = await promotionSales(data);
    return response;
  }
);
export const getDownlinePromotions = createAsyncThunk(
  "promotion/getDownlinePromotions",
  async (data: any) => {
    const response = await downlinePromotion(data);
    return response;
  }
);
export const getRecruits = createAsyncThunk(
  "promotion/getRecruits",
  async (data: any) => {
    const response = await recruitListing(data);
    return response;
  }
);
export const getPromotionDetail = createAsyncThunk(
  "promotion/getPromotionDetail",
  async (data: any) => {
    const response = await promotionDetail(data);
    return response;
  }
);
export const getUpdatePromotion = createAsyncThunk(
  "promotion/updatePromotion",
  async (data: any) => {
    const response = await updatePromotion(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    setResetPromotionDetail: (state) => {
      state.promotion = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPromotionList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.promotions = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getSalesList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sales = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getDownlinePromotions.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.dwPromotions = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getRecruits.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.recruits = action.payload?.message?.data;
          state.total = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getPromotionDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.promotion = action.payload?.message;
        }
      })
      
  },
});

export const { setResetPromotionDetail } =
  reducerSlice.actions;

export const selectPromotion = (state: AppState) =>
  state.promotion?.promotion;
export const selectPromotions = (state: AppState) =>
  state.promotion?.promotions;
export const selectSales = (state: AppState) =>
  state.promotion?.sales;
export const selectDwPromotions = (state: AppState) =>
  state.promotion?.dwPromotions;
export const selectRecruits = (state: AppState) =>
  state.promotion?.recruits;
export const selectTotal = (state: AppState) =>
  state.promotion?.total;

export const selectExtra = (state: AppState) => state.promotion?.extra;
export default reducerSlice.reducer;
