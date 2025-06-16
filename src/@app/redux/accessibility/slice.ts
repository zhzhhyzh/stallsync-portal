import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { addUpdateAccessibility, listAccessibility } from "./api";

export interface State {
  accessibility: any;
  accessibilityTotal: number;
}

const initialState: State = {
  accessibility: [],
  accessibilityTotal: 0
};

export const fetchAccessibility = createAsyncThunk(
  "accessibilities/fetchAccessibility",
  async (data: any) => {
    const response = await listAccessibility(data);
    return response;
  }
);

export const manageAccessActions = createAsyncThunk(
  'accessibilities/manage',
  async (data: any) => {
      const response = await addUpdateAccessibility(data)
      return response
  }
)

export const reducerSlice = createSlice({
  name: "accessibility",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessibility.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accessibility = action.payload?.message?.data;
          state.accessibilityTotal = action.payload?.message?.total;
        }
      })
  },
});

export const selectAccessibility = (state: AppState) =>
  state.accessibility?.accessibility;
export const selectAccessibilityTotal = (state: AppState) =>
  state.accessibility?.accessibilityTotal;

export default reducerSlice.reducer;
