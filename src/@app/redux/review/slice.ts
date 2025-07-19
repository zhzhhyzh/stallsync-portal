import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import {
  listReviewM,
  // manageMerchant,merchantDetail,removeMerchant 
} from "./api";

export interface State {
  review: any[];
  // merchantDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  review: [],
  // merchantDetail: {},
  total: 0,
  extra: {},
};

export const fetchReview = createAsyncThunk(
  "review/fetchReview",
  async (data: any) => {
    const response = await listReviewM(data);
    return response;
  }
);

// export const getmerchantDetail = createAsyncThunk(
//   "review/getmerchantDetail",
//   async (data: any) => {
//     const response = await merchantDetail(data);
//     return response;
//   }
// );

// export const getmanageMerchant = createAsyncThunk(
//   "review/getmanageMerchant",
//   async (data: any) => {
//     const response = await manageMerchant(data);
//     return response;
//   }
// );

// export const getremoveMerchant = createAsyncThunk(
//   "review/getremoveMerchant",
//   async (data: any) => {
//     const response = await removeMerchant(data);
//     return response;
//   }
// );

export const reducerSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReview.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.review = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      // .addCase(getmerchantDetail.fulfilled, (state, action) => {
      //   state.merchantDetail = action.payload?.message
      // })
  },
});

export const selectReviews = (state: AppState) =>
  state.review?.review;
// export const selectMerchant = (state: AppState) => state.review?.merchantDetail;
export const selectTotal = (state: AppState) => state.review?.total;;
export const selectExtra = (state: AppState) => state.review?.extra;

export default reducerSlice.reducer;
