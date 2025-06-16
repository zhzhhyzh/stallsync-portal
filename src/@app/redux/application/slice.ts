import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { manageApplication, removeApplication, applicationDetail, applicationList, applicationDocDetail,applicationDocList,manageApplicationDoc,removeApplicationDoc, approveApplication } from "./api";

export interface State {
    applications: any[]; //list
    applicationsTotal: number;
    application: any; //detail
    applicationDocs: any; //detail
    applicationDoc: any; //detail
    applicationDocsTotal: number; //detail
    extra: any;
}

const initialState: State = {
  applications: [],
  applicationsTotal: 0,
  application: {},
  extra: {},
  applicationDocs: [],
  applicationDoc: {},
  applicationDocsTotal: 0
};

export const getApplicationList = createAsyncThunk(
  "application/getApplicationList",
  async (data: any) => {
    const response = await applicationList(data);
    return response;
  }
);

export const getApplicationDetail = createAsyncThunk(
  "application/getApplicationDetail",
  async (data: any) => {
    const response = await applicationDetail(data);
    return response;
  }
);

export const getManageApplication = createAsyncThunk(
  "application/getManageApplication",
  async (data: any) => {
    const response = await manageApplication(data);
    return response;
  }
);

export const getRemoveApplication = createAsyncThunk(
  "application/getRemoveApplication",
  async (data: any) => {
    const response = await removeApplication(data);
    return response;
  }
);
export const getApproveApplication = createAsyncThunk(
  "application/getApproveApplication",
  async (data: any) => {
    const response = await approveApplication(data);
    return response;
  }
);
export const getApplicationDocList = createAsyncThunk(
  "application/getApplicationDocList",
  async (data: any) => {
    const response = await applicationDocList(data);
    return response;
  }
);

export const getApplicationDocDetail = createAsyncThunk(
  "application/getApplicationDocDetail",
  async (data: any) => {
    const response = await applicationDocDetail(data);
    return response;
  }
);

export const getManageApplicationDoc = createAsyncThunk(
  "application/getManageApplicationDoc",
  async (data: any) => {
    const response = await manageApplicationDoc(data);
    return response;
  }
);

export const getRemoveApplicationDoc = createAsyncThunk(
  "application/getRemoveApplicationDoc",
  async (data: any) => {
    const response = await removeApplicationDoc(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setResetApplicationDetail: (state) => {
      state.application = {};
    },
    setResetApplicationDocDetail: (state) => {
      state.applicationDoc = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.applications = action.payload?.message?.data;
          state.applicationsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getApplicationDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.application = action.payload?.message;
        }
      })
      .addCase(getApplicationDocList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.applicationDocs = action.payload?.message?.data;
          state.applicationDocsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getApplicationDocDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.applicationDoc = action.payload?.message;
        }
      });
  },
});

export const { setResetApplicationDetail, setResetApplicationDocDetail } =
  reducerSlice.actions;

export const selectApplications = (state: AppState) =>
  state.application?.applications;
export const selectApplicationsTotal = (state: AppState) =>
  state.application?.applicationsTotal;
export const selectApplication = (state: AppState) =>
  state.application?.application;
export const selectExtra = (state: AppState) => state.application?.extra;
export const selectApplicationDocs = (state: AppState) =>
  state.application?.applicationDocs;
export const selectApplicationDocsTotal = (state: AppState) =>
  state.application?.applicationDocsTotal;
export const selectApplicationDoc = (state: AppState) =>
  state.application?.applicationDoc;

export default reducerSlice.reducer;
