import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { tableKeyList, tableKeyDetail, removeTableKey, manageTableKey } from "./api";

export interface State {
  tableKey: any[];
  tableKeyDetail: any;
  tableKeyTotal: number;
  extra: any;
}

const initialState: State = {
  tableKey: [],
  tableKeyDetail: {},
  tableKeyTotal: 0,
  extra: {},
};

export const fetchTableKeyList = createAsyncThunk(
  "tableKeys/fetchTableKeyList",
  async (data: any) => {
    const response = await tableKeyList(data);
    return response;
  }
);

export const getManageTableKey = createAsyncThunk(
  "tableKeys/getManageTableKey",
  async (data: any) => {
    const response = await manageTableKey(data);
    return response;
  }
);

export const fetchTableKeyDetail = createAsyncThunk(
  "tableKeys/fetchTableKeyDetail",
  async (data: any) => {
    const response = await tableKeyDetail(data);
    return response;
  }
);

export const getRemoveTableKey = createAsyncThunk(
  "tableKeys/getRemoveFileManagement",
  async (data: any) => {
    const response = await removeTableKey(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "tableKeys",
  initialState,
  reducers: {
    setResetTableKeyDetail: (state) => {
      state.tableKeyDetail = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableKeyList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.tableKey = action.payload?.message?.data;
          state.tableKeyTotal = action.payload?.message?.total;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchTableKeyDetail.fulfilled, (state, action) => {
        state.tableKeyDetail = action.payload?.message
      })
  },
});

export const selectTableKeys = (state: AppState) =>
  state.tableKey?.tableKey;
export const selectTableKey = (state: AppState) => state.tableKey?.tableKeyDetail;
export const selectTableKeysTotal = (state: AppState) => state.tableKey?.tableKeyTotal;
export const selectExtra = (state: AppState) => state.tableKey?.extra;

export default reducerSlice.reducer;
export const { setResetTableKeyDetail } = reducerSlice.actions;