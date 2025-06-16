import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listHoliday,manageHoliday,holidayDetail,removeHoliday } from "./api";

export interface State {
  holidays: any[];
  holidayDetail: any;
  total: number;
  extra: any;
}

const initialState: State = {
  holidays: [],
  holidayDetail: {},
  total: 0,
  extra: {},
};

export const fetchholiday = createAsyncThunk(
  "holidays/fetchholiday",
  async (data: any) => {
    const response = await listHoliday(data);
    return response;
  }
);

export const getholidayDetail = createAsyncThunk(
  "holidays/getholidayDetail",
  async (data: any) => {
    const response = await holidayDetail(data);
    return response;
  }
);

export const getmanageHoliday = createAsyncThunk(
  "holidays/getmanageHoliday",
  async (data: any) => {
    const response = await manageHoliday(data);
    return response;
  }
);

export const getremoveHoliday = createAsyncThunk(
  "holidays/getremoveHoliday",
  async (data: any) => {
    const response = await removeHoliday(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "Holiday",
  initialState,
  reducers: {
    setResetholidayDetail:(state)=>{
      state.holidayDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchholiday.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.holidays = action.payload?.message?.data;
          state.total = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getholidayDetail.fulfilled, (state, action) => {
        state.holidayDetail = action.payload?.message
      })
  },
});

export const selectholidays = (state: AppState) =>
  state.holiday?.holidays;
export const selectholiday = (state: AppState) => state.holiday?.holidayDetail;
export const selectTotal = (state: AppState) => state.holiday?.total;
export const selectExtra = (state: AppState) => state.holiday?.extra;
export const {setResetholidayDetail} = reducerSlice.actions;
export default reducerSlice.reducer;
