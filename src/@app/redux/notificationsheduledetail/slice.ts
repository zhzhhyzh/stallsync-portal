import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import {
  addSchedule,
  deleteSchedule,
  detailSchedule,
  listSchedule,
  listScheduleDetail,
  listScheduleRecipients,
  updateSchedule,
} from "./api";

export interface State {
  schedule: any[];
  scheduleTotal: number;
  scheduleDetail: any;
  scheduledDetail: any;
  extra: any;

  scheduleRecipients: any[];
  scheduleRecipientsTotal: number;
  scheduleRecipientsExtra: any;
}

const initialState: State = {
  schedule: [],
  scheduleTotal: 0,
  scheduleDetail: {},
  scheduledDetail: {},

  extra: {},

  scheduleRecipients: [],
  scheduleRecipientsTotal: 0,
  scheduleRecipientsExtra: {},
};

export const fetchSchedules = createAsyncThunk(
  "schedule/fetchSchedules",
  async (data: any) => {
    const response = await listSchedule(data);
    return response;
  }
);

export const fetchScheduleDetail = createAsyncThunk(
  "schedule/fetchScheduleDetail",
  async (data: any) => {
    const response = await detailSchedule(data);
    return response;
  }
);

export const fetchScheduledDetail = createAsyncThunk(
  "schedule/fetchScheduledDetail",
  async (data: any) => {
    const response = await listScheduleDetail(data);
    return response;
  }
);

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (data: any) => {
    const response = await addSchedule(data);
    return response;
  }
);

export const removeSchedule = createAsyncThunk(
  "schedule/removeSchedule",
  async (data: any) => {
    const response = await deleteSchedule(data);
    return response;
  }
);

export const amendSchedule = createAsyncThunk(
  "schedule/amendSchedule",
  async (data: any) => {
    const response = await updateSchedule(data);
    return response;
  }
);

export const fetchScheduleRecipients = createAsyncThunk(
  "schedule/fetchScheduleRecipients",
  async (data: any) => {
    const response = await listScheduleRecipients(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setResetScheduleDetail: (state) => {
      state.scheduleDetail = {};
    },
    setResetScheduledDetail: (state) => {
      state.scheduledDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.schedule = action.payload?.message?.data;
          state.scheduleTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchScheduleDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.scheduleDetail = action.payload?.message;
        }
      })
      .addCase(fetchScheduledDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.scheduledDetail = action.payload?.message;
        }
      })
      .addCase(fetchScheduleRecipients.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.scheduleRecipients = action.payload?.message?.data;
          state.scheduleRecipientsTotal = action.payload?.message?.total || 10;
          state.scheduleRecipientsExtra = action.payload?.message?.extra;
        }
      });
  },
});

export const { setResetScheduleDetail, setResetScheduledDetail } =
  reducerSlice.actions;

export const selectSchedule = (state: AppState) =>
  state.scheduleDetail?.scheduleDetail;
export const selectSchedules = (state: AppState) =>
  state.scheduleDetail?.schedule;
export const selectSchedulesTotal = (state: AppState) =>
  state.scheduleDetail?.scheduleTotal;
export const selectExtra = (state: AppState) => state.scheduleDetail?.extra;
export const selectScheduled = (state: AppState) =>
  state.scheduleDetail?.scheduledDetail;

export const selectScheduleRecipients = (state: AppState) =>
  state.scheduleDetail?.scheduleRecipients;
export const selectScheduleRecipientsTotal = (state: AppState) =>
  state.scheduleDetail?.scheduleRecipientsTotal;
export const selectScheduleRecipientsExtra = (state: AppState) =>
  state.scheduleDetail?.scheduleRecipientsExtra;

export default reducerSlice.reducer;
