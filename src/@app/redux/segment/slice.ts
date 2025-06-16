import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { addUpdateSegment, detailSegment, listSegment, listSegmentPreview, removeSegment } from "./api";

export interface State {
  segment: any[];
  segmentTotal: number;
  previewSegment: any[];
  previewSegmentTotal: number;
  segmentDetail: any;
  extra: any;
  previewSegmentExtra: any;
}

const initialState: State = {
  segment: [],
  segmentTotal: 0,
  previewSegment: [],
  previewSegmentTotal: 0,
  segmentDetail: {},
  extra: {},
  previewSegmentExtra: {},
};

export const fetchSegments = createAsyncThunk(
  "segment/fetchSegments",
  async (data: any) => {
    const response = await listSegment(data);
    return response;
  }
);

export const fetchSegmentDetail = createAsyncThunk(
  "segment/fetchSegmentDetail",
  async (data: any) => {
    const response = await detailSegment(data);
    return response;
  }
);

export const fetchPreviewSegments = createAsyncThunk(
  "segment/fetchPreviewSegments",
  async (data: any) => {
    const response = await listSegmentPreview(data);
    return response;
  }
);

export const manageSegment = createAsyncThunk(
  "segment/manage",
  async (data: any) => {
    const response = await addUpdateSegment(data);
    return response;
  }
);

export const getRemoveSegment = createAsyncThunk(
  "segment/remove",
  async (data: any) => {
    const response = await removeSegment(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "segments",
  initialState,
  reducers: {
    setResetSegmentsDetail: (state) => {
      state.segmentDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSegments.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.segment = action.payload?.message?.data;
          state.segmentTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchPreviewSegments.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.previewSegment = action.payload?.message?.data;
          state.previewSegmentTotal = action.payload?.message?.total || 10;
          state.previewSegmentExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchSegmentDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.segmentDetail = action.payload?.message;
        }
      });
  },
});

export const { setResetSegmentsDetail } =
  reducerSlice.actions;

export const selectSegments = (state: AppState) =>
  state.segment?.segment;
export const selectSegmentsTotal = (state: AppState) =>
  state.segment?.segmentTotal;
  export const selectPreviewSegments = (state: AppState) =>
  state.segment?.previewSegment;
export const selectPreviewSegmentsTotal = (state: AppState) =>
  state.segment?.previewSegmentTotal;
export const selectSegment = (state: AppState) =>
  state.segment?.segmentDetail;
export const selectExtra = (state: AppState) => state.segment?.extra;
export const selectPreviewSegmentExtra = (state: AppState) => state.segment?.previewSegmentExtra;

export default reducerSlice.reducer;