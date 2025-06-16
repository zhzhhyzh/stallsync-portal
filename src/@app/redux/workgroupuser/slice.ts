import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
// import { workgroupDetail, workgroupList, deleteWorkgroup, manageWorkgroup } from "./api";
import { workgroupUserLink, workgroupUserList, workgroupUserUnlink } from "./api";

export interface State {
  workgroupUsers: any[];
  workgroupUsersTotal: number;
  extra: any;
}

const initialState: State = {
  workgroupUsers: [],
  workgroupUsersTotal: 0,
  extra: {},
};

export const fetchWorkgroupUserList = createAsyncThunk(
  "workgroupusers/fetchWorkgroupUserList",
  async (data: any) => {
    const response = await workgroupUserList(data);
    return response;
  }
);

export const getLinkWorkgroupUser = createAsyncThunk(
  "workgroupusers/getLinkWorkgroupUser",
  async (data: any) => {
    const response = await workgroupUserLink(data);
    return response;
  }
);

export const getUnlinkWorkgroupUser = createAsyncThunk(
  "workgroupusers/getUnlinkWorkgroupUser",
  async (data: any) => {
    const response = await workgroupUserUnlink(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "workgroupusers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkgroupUserList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.workgroupUsers = action.payload?.message?.data;
          state.workgroupUsersTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
    //   .addCase(fetchWorkgroupDetail.fulfilled, (state, action) => {
    //     if (action.payload.httpCode < 400) {
    //       state.workgroupsDetail = action.payload?.message;
    //     }
    //   });
  },
});

export const selectWorkgroupUsers = (state: AppState) =>
  state.workgroupuser?.workgroupUsers;
export const selectWorkgroupUsersTotal = (state: AppState) =>
  state.workgroupuser?.workgroupUsersTotal;
// export const selectWorkgroup = (state: AppState) =>
//   state.workgroup?.workgroupsDetail; //detail
export const selectExtra = (state: AppState) => state.workgroupuser?.extra;

export default reducerSlice.reducer;