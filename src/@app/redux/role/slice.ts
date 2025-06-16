import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listRoleCode, manageRoleCode, roleCodeDetail, removeRoleCode } from "./api";

export interface State {
    roleCodes: any[];
    roleCodeDetail: any;
    total: number;
    extra: any;
}

const initialState: State = {
    roleCodes: [],
    roleCodeDetail: {},
    total: 0,
    extra: {},
};

export const fetchRoleCodes = createAsyncThunk(
    "roleCodes/fetchRoleCodes",
    async (data: any) => {
        const response = await listRoleCode(data);
        return response;
    }
);

export const getRoleCodeDetail = createAsyncThunk(
    "roleCodes/getRoleCodeDetail",
    async (data: any) => {
        const response = await roleCodeDetail(data);
        return response;
    }
);

export const getManageRoleCode = createAsyncThunk(
    "roleCodes/getManageRoleCode",
    async (data: any) => {
        const response = await manageRoleCode(data);
        return response;
    }
);

export const getRemoveRoleCode = createAsyncThunk(
    "roleCodes/getRemoveRoleCode",
    async (data: any) => {
        const response = await removeRoleCode(data);
        return response;
    }
);

export const reducerSlice = createSlice({
    name: "roleCodes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoleCodes.fulfilled, (state, action) => {
                if (action.payload.httpCode < 400) {
                    state.roleCodes = action.payload?.message?.data;
                    state.total = action.payload?.message?.total;
                    state.extra = action.payload?.message?.extra;
                }
            })
            .addCase(getRoleCodeDetail.fulfilled, (state, action) => {
                state.roleCodeDetail = action.payload?.message
            })
    },
});

export const selectRoleCodes = (state: AppState) =>
    state.roleCodes?.roleCodes;
export const selectRoleCode = (state: AppState) => state.roleCodes?.roleCodeDetail;
export const selectTotal = (state: AppState) => state.roleCodes?.total;;
export const selectExtra = (state: AppState) => state.roleCodes?.extra;

export default reducerSlice.reducer;
