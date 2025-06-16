import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { manageCheckerMaker, removeCheckerMaker, checkerMakerDetail, checkerMakerList } from "./api";

export interface State {
    makers: any[]; //list
    makersTotal: number;
    maker: any; //detail
    extra: any;
}

const initialState: State = {
    makers: [],
    makersTotal: 0,
    maker: {},
    extra: {},
};

export const getCheckerMakerList = createAsyncThunk(
  "checkerMaker/getCheckerMakerList",
  async (data: any) => {
    const response = await checkerMakerList(data);
    return response;
  }
);

export const getCheckerMakerDetail = createAsyncThunk(
  "checkerMaker/getCheckerMakerDetail",
  async (data: any) => {
    const response = await checkerMakerDetail(data);
    return response;
  }
);

export const getManageCheckerMaker = createAsyncThunk(
  "checkerMaker/getManageCheckerMaker",
  async (data: any) => {
    const response = await manageCheckerMaker(data);
    return response;
  }
);

export const getRemoveCheckerMaker = createAsyncThunk(
  "checkerMaker/getRemoveCheckerMaker",
  async (data: any) => {
    const response = await removeCheckerMaker(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "checkerMaker",
  initialState,
  reducers: {
    setResetCheckerMakerDetail: (state) => {
      state.maker = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCheckerMakerList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.makers = action.payload?.message?.data;
          state.makersTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getCheckerMakerDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.maker = action.payload?.message;
        }
      });
  },
});

export const { setResetCheckerMakerDetail } =
  reducerSlice.actions;

export const selectCheckerMakers = (state: AppState) =>
  state.checkerMaker?.makers;
export const selectCheckerMakersTotal = (state: AppState) =>
  state.checkerMaker?.makersTotal;
export const selectCheckerMaker = (state: AppState) =>
  state.checkerMaker?.maker;
export const selectExtra = (state: AppState) => state.checkerMaker?.extra;
export default reducerSlice.reducer;
