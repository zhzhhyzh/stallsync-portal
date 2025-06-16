import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { fileManagementList, fileManagementDetail, removeFileManagement, manageFileManagement } from "./api";

export interface State {
  fileManagement: any[];
  fileManagementDetail: any;
  fileManagementTotal: number;
  extra: any;
}

const initialState: State = {
  fileManagement: [], 
  fileManagementDetail: {},
  fileManagementTotal: 0,
  extra: {},
};

export const fetchFileManagementList = createAsyncThunk(
  "fileManagements/fetchFileManagementList",
  async (data: any) => {
    const response = await fileManagementList(data);
    return response;
  }
);

export const getFileManagementDetail = createAsyncThunk(
  "fileManagements/getFileManagementDetail",
  async (data: any) => {
    const response = await fileManagementDetail(data);
    return response;
  }
);

export const getManageFileManagement = createAsyncThunk(
  "fileManagements/getManageFileManagement",
  async (data: any) => {
    const response = await manageFileManagement(data);
    return response;
  }
);

export const getRemoveFileManagement = createAsyncThunk(
  "fileManagements/getRemoveFileManagement",
  async (data: any) => {
    const response = await removeFileManagement(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "fileManagements",
  initialState,
  reducers: {
    setResetFileManagementDetail: (state) => {
      state.fileManagementDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileManagementList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.fileManagement = action.payload?.message?.data;
          state.fileManagementTotal = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getFileManagementDetail.fulfilled, (state, action) => {
        state.fileManagementDetail = action.payload?.message
      })
  },
});

export const selectFileManagements = (state: AppState) =>
  state.fileManagement?.fileManagement;
export const selectFileManagement = (state: AppState) => state.fileManagement?.fileManagementDetail;
export const selectFileManagementsTotal = (state: AppState) => state.fileManagement?.fileManagementTotal;
export const selectExtra = (state: AppState) => state.fileManagement?.extra;

export default reducerSlice.reducer;
export const { setResetFileManagementDetail } = reducerSlice.actions;