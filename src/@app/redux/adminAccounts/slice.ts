import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { detailAdmin, listAdmin, addUpdateAdmin, removeAdmin, resetAdminPassword } from "./api";

export interface State {
  admin: any[];
  adminTotal: number;
  adminDetail: any;
  extra: any;
}

const initialState: State = {
  admin: [],
  adminTotal: 0,
  adminDetail: {},
  extra: {},
};

export const fetchAdminAccounts = createAsyncThunk(
  "admins/fetchAdminAccounts",
  async (data: any) => {
    const response = await listAdmin(data);
    return response;
  }
);

export const fetchAdminDetail = createAsyncThunk(
  "admins/fetchAdminDetail",
  async (data: any) => {
    const response = await detailAdmin(data);
    return response;
  }
);

export const manageAdmin = createAsyncThunk(
  "admins/manage",
  async (data: any) => {
    const response = await addUpdateAdmin(data);
    return response;
  }
);

export const getRemoveAdmin = createAsyncThunk(
  "admins/remove",
  async (data: any) => {
    const response = await removeAdmin(data);
    return response;
  }
);

export const changeAdminPassword = createAsyncThunk(
  "admins/changeAdminPassword",
  async (data: any) => {
    const response = await resetAdminPassword(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "adminAccounts",
  initialState,
  reducers: {
    setResetAdminAccountsDetail: (state) => {
      state.adminDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAccounts.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.admin = action.payload?.message?.data;
          state.adminTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchAdminDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.adminDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetAdminAccountsDetail } =
  reducerSlice.actions;

export const selectAdminAccounts = (state: AppState) =>
  state.adminAccounts?.admin;
export const selectAdminAccountsTotal = (state: AppState) =>
  state.adminAccounts?.adminTotal;
export const selectAdminAccount = (state: AppState) =>
  state.adminAccounts?.adminDetail;
export const selectExtra = (state: AppState) => state.adminAccounts?.extra;

export default reducerSlice.reducer;