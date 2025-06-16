import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import {
  addUpdateNotificationTemplate,
  ddlSegment,
  detailNotificationTemplate,
  listNotificationTemplate,
  newMessageSend,
  removeNotificationTemplate,
  testSend,
  validateTemplate,
} from "./api";

export interface State {
  maintLog: any[];
  totalMaintLog: any;
  error: any;
  status: any;

  notificationTemplateDetail: any;
  notificationTemplates: any[];
  total: number;
  extra: any;

  segment: any[];
}

const initialState: State = {
  maintLog: [],
  totalMaintLog: 0,
  error: {},
  status: 0,
  notificationTemplateDetail: {},
  notificationTemplates: [],

  total: 0,
  extra: {},

  segment: [],
};

export const fetchNotificationTemplates = createAsyncThunk(
  "notificationtemplate/fetchNotificationTemplates",
  async (data: any) => {
    const response = await listNotificationTemplate(data);
    return response;
  }
);

export const fetchNotificationTemplateDetail = createAsyncThunk(
  "notificationtemplate/fetchNotificationTemplateDetail",
  async (data: any) => {
    const response = await detailNotificationTemplate(data);
    return response;
  }
);

export const manageNotificationTemplate = createAsyncThunk(
  "notificationtemplate/manage",
  async (data: any) => {
    const response = await addUpdateNotificationTemplate(data);
    return response;
  }
);

export const getRemoveNotificationTemplate = createAsyncThunk(
  "notificationtemplate/remove",
  async (data: any) => {
    const response = await removeNotificationTemplate(data);
    return response;
  }
);

export const sendMessage = createAsyncThunk(
  "notificationtemplate/sendMessage",
  async (data: any) => {
    const response = await testSend(data);
    return response;
  }
);

export const sendNewMessage = createAsyncThunk(
  "notificationtemplate/sendNewMessage",
  async (data: any) => {
    const response = await newMessageSend(data);
    return response;
  }
);

export const fetchDDLSegment = createAsyncThunk(
  "notificationtemplate/fetchDDLSegment",
  async (data: any) => {
    const response = await ddlSegment(data);
    return response;
  }
);

export const checkTemplate = createAsyncThunk(
  "notificationtemplate/checkTemplate",
  async (data: any) => {
    const response = await validateTemplate(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "notTemplate",
  initialState,
  reducers: {
    setResetNotificationTemplateDetail: (state) => {
      state.notificationTemplateDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationTemplates.fulfilled, (state, action) => {
        state.notificationTemplates = action.payload?.message?.data;
        state.total = action.payload?.message?.total;
        state.extra = action.payload?.message?.extra;
      })
      .addCase(fetchNotificationTemplateDetail.fulfilled, (state, action) => {
        state.notificationTemplateDetail = action.payload?.message;
      })
      .addCase(fetchDDLSegment.fulfilled, (state, action) => {
        state.segment = action.payload?.message;
      });
  },
});

export const { setResetNotificationTemplateDetail } = reducerSlice.actions;

export const selectNotificationTemplates = (state: AppState) =>
  state.notificationTemplate?.notificationTemplates;
export const selectNotificationTemplate = (state: AppState) =>
  state.notificationTemplate?.notificationTemplateDetail;
export const selectMaintlog = (state: AppState) =>
  state.notificationTemplate?.maintLog;
export const selectTotal = (state: AppState) =>
  state.notificationTemplate?.total;
export const selectTotalMaintLog = (state: AppState) =>
  state.notificationTemplate.totalMaintLog;

export const selectExtra = (state: AppState) =>
  state.notificationTemplate.extra;

export const selectSegment = (state: AppState) =>
  state.notificationTemplate.segment;

export default reducerSlice.reducer;
