import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { manageMember, memberDetail, memberList, memberProfile, memberSales, updateProfile} from "./api";

export interface State {
    members: any[]; //list
    membersTotal: number;
    sales: any[]; //list
    salesTotal: number;
    member: any; //detail
    extra: any;
}

const initialState: State = {
  members: [],
  membersTotal: 0,
  member: {},
  extra: {},
  sales:[],
  salesTotal:0,
};

export const getMemberList = createAsyncThunk(
  "member/getMemberList",
  async (data: any) => {
    const response = await memberList(data);
    return response;
  }
);
export const getMemberSales = createAsyncThunk(
  "member/getMemberSales",
  async (data: any) => {
    const response = await memberSales(data);
    return response;
  }
);

export const getMemberDetail = createAsyncThunk(
  "member/getMemberDetail",
  async (data: any) => {
    const response = await memberDetail(data);
    return response;
  }
);
export const getMemberProfile = createAsyncThunk(
  "member/getMemberProfile",
  async (data: any) => {
    const response = await memberProfile(data);
    return response;
  }
);

export const getManageMember = createAsyncThunk(
  "member/getManageMember",
  async (data: any) => {
    const response = await manageMember(data);
    return response;
  }
);
export const getUpdateProfile = createAsyncThunk(
  "member/getUpdateProfile",
  async (data: any) => {
    const response = await updateProfile(data);
    return response;
  }
);




export const reducerSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setResetMemberDetail: (state) => {
      state.member = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMemberList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.members = action.payload?.message?.data;
          state.membersTotal = action.payload?.message?.total || 0;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getMemberSales.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sales = action.payload?.message?.data;
          state.salesTotal = action.payload?.message?.total || 0;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getMemberDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.member = action.payload?.message;
        }
      })
   
      .addCase(getMemberProfile.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.member = action.payload?.message;
        }
      })
   
  },
});

export const { setResetMemberDetail } =
  reducerSlice.actions;

export const selectMembers = (state: AppState) =>
  state.member?.members;
export const selectMembersTotal = (state: AppState) =>
  state.member?.membersTotal;
export const selectSales = (state: AppState) =>
  state.member?.sales;
export const selectSalesTotal = (state: AppState) =>
  state.member?.salesTotal;
export const selectMember = (state: AppState) =>
  state.member?.member;
export const selectExtra = (state: AppState) => state.member?.extra;


export default reducerSlice.reducer;
