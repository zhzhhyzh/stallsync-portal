import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { listBackup, backup, download} from "./api";

export interface State {
  error: any;
  status: any;
  list: any[]; //list
  total: number;

}

const initialState: State = {
  error: {},
  status: 0,
  total: 0,
  list: [],

};

export const fetchBackup = createAsyncThunk(
  "backup/fetchBackup",
  async (data: any) => {
    const response = await listBackup(data);
    return response;
  }
);

export const backupFile = createAsyncThunk(
  'backups/backup',
  async (data: any) => {
      const response = await backup(data)
      return response
  }
)

export const downloadFile = createAsyncThunk(
  'backups/download',
  async (data: any) => {
      const response = await download(data)
      return response
  }
)

export const reducerSlice = createSlice({
  name: "backup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBackup.fulfilled, (state, action) => {
      state.list = action.payload?.message?.data
      state.total = action.payload?.message?.total
  })
  },
});

export const selectBackup = (state: AppState) => state.backupDatabase.list
export const selectTotal = (state: AppState) => state.backupDatabase.total


export default reducerSlice.reducer;
