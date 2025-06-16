import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listType, detailType, addUpdateType, removeType, listCode, detailCode, addUpdateCode, removeCode } from "./api";

export interface State {
  genType: any[];
  genTypeTotal: number;
  genTypeDetail: any;
  extraType: any;

  genCode: any[];
  genCodeTotal: number;
  genCodeDetail: any;
  extraCode: any;
}

const initialState: State = {
  genType: [],
  genTypeTotal: 0,
  genTypeDetail: {},
  extraType: {},

  genCode: [],
  genCodeTotal: 0,
  genCodeDetail: {},
  extraCode: {},
};

export const fetchGenType = createAsyncThunk(
  "general/fetchGenType",
  async (data: any) => {
    const response = await listType(data);
    return response;
  }
);

export const fetchGenTypeDetail = createAsyncThunk(
  "general/fetchGenTypeDetail",
  async (data: any) => {
    const response = await detailType(data);
    return response;
  }
);

export const manageGenType = createAsyncThunk(
  "general/manageGenType",
  async (data: any) => {
    const response = await addUpdateType(data);
    return response;
  }
);

export const getRemoveGenType = createAsyncThunk(
  "general/removeGenType",
  async (data: any) => {
    const response = await removeType(data);
    return response;
  }
);

export const fetchGenCode = createAsyncThunk(
  "general/fetchGenCode",
  async (data: any) => {
    const response = await listCode(data);
    return response;
  }
);

export const fetchGenCodeDetail = createAsyncThunk(
  "general/fetchGenCodeDetail",
  async (data: any) => {
    const response = await detailCode(data);
    return response;
  }
);

export const manageGenCode = createAsyncThunk(
  "general/manageGenCode",
  async (data: any) => {
    const response = await addUpdateCode(data);
    return response;
  }
);

export const getRemoveGenCode = createAsyncThunk(
  "general/removeGenCode",
  async (data: any) => {
    const response = await removeCode(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "generalParameter",
  initialState,
  reducers: {
    setResetGenTypeDetail: (state) => {
      state.genTypeDetail = {};
    },
    setResetGenCodeDetail: (state) => {
      state.genCodeDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenType.fulfilled, (state, action) => {
        state.genType = action.payload?.message?.data
        
        state.genTypeTotal = action.payload?.message?.total
        state.extraType = action.payload?.message?.extra;
      })
      .addCase(fetchGenTypeDetail.fulfilled, (state, action) => {
          state.genTypeDetail = action.payload?.message
      })
      .addCase(fetchGenCode.fulfilled, (state, action) => {
          state.genCode = action.payload?.message?.data
          state.genCodeTotal = action.payload?.message?.total
          state.extraCode = action.payload?.message?.extra;
      })
      .addCase(fetchGenCodeDetail.fulfilled, (state, action) => {
          state.genCodeDetail = action.payload?.message?.gencde
      })
  },
});

export const { setResetGenTypeDetail, setResetGenCodeDetail } =
  reducerSlice.actions;

export const selectGeneralTypes = (state: AppState) => state.generalParam?.genType
export const selectGeneralType = (state: AppState) => state.generalParam?.genTypeDetail
export const selectTotalType = (state: AppState) => state.generalParam?.genTypeTotal
export const selectExtraType = (state: AppState) => state.generalParam?.extraType;

export const selectGeneralCodes = (state: AppState) => state.generalParam?.genCode 
export const selectGeneralCode = (state: AppState) => state.generalParam?.genCodeDetail 
export const selectTotalCode = (state: AppState) => state.generalParam?.genCodeTotal
export const selectExtraCode = (state: AppState) => state.generalParam?.extraCode;

export default reducerSlice.reducer;