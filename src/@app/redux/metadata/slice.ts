import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { addUpdateMetadata, detailMetadata, listMetadata, removeMetadata, uploadMetadata, uploadMetadataJSON } from "./api";

export interface State {
  metadatas: any[];
  metadataTotal: number;
  metadataDetail: any;
  extra: any;
}

const initialState: State = {
  metadatas: [],
  metadataTotal: 0,
  metadataDetail: {},
  extra: {},
};

export const fetchMetadatas = createAsyncThunk(
  "metadata/fetchMetadatas",
  async (data: any) => {
    const response = await listMetadata(data);
    return response;
  }
);

export const fetchMetadataDetail = createAsyncThunk(
  "metadata/fetchMetadataDetail",
  async (data: any) => {
    const response = await detailMetadata(data);
    return response;
  }
);

export const manageMetadata = createAsyncThunk(
  "metadata/manage",
  async (data: any) => {
    const response = await addUpdateMetadata(data);
    return response;
  }
);

export const deleteMetadata = createAsyncThunk(
  "metadata/delete",
  async (data: any) => {
    const response = await removeMetadata(data);
    return response;
  }
);

export const uploadMetadataFile = createAsyncThunk(
  "metadata/uploadMetadataFile",
  async (data: any) => {
    const response = await uploadMetadata(data);
    return response;
  }
);
export const uploadMetadataJSONFile = createAsyncThunk(
  "metadata/uploadMetadataJSONFile",
  async (data: any) => {
    const response = await uploadMetadataJSON(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setResetMetadatasDetail: (state) => {
      state.metadataDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetadatas.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.metadatas = action.payload?.message?.data;
          state.metadataTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchMetadataDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.metadataDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetMetadatasDetail } =
  reducerSlice.actions;

export const selectMetadatas = (state: AppState) =>
  state.metadata?.metadatas;
export const selectMetadatasTotal = (state: AppState) =>
  state.metadata?.metadataTotal;
export const selectMetadata = (state: AppState) =>
  state.metadata?.metadataDetail;
export const selectExtra = (state: AppState) => state.metadata?.extra;

export default reducerSlice.reducer;