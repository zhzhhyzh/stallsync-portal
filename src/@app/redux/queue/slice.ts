import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import {
  actActDetail, actActList, deleteActAct, manageActAct,
  actDetail, actList, deleteAct, manageAct,
  manageQueue, queueDetail, queueList, deleteQueue,
  actChkDetail, actChkList, deleteActChk, manageActChk, actchkactactfind
} from "./api";

export interface State {
  activityAct: any[];
  activityActTotal: number;
  activityActDetail: any;
  actactextra: any;

  activityChk: any[];
  activityChkTotal: number;
  activityChkDetail: any;
  actchkextra: any;

  activity: any[];
  activityTotal: number;
  activityDetail: any;
  actextra: any;

  queue: any[];
  queueTotal: number;
  queueDetail: any;
  queueextra: any;

  actChkFind: any;
}

const initialState: State = {

  activityAct: [],
  activityActTotal: 0,
  activityActDetail: {},
  actactextra: {},

  activityChk: [],
  activityChkTotal: 0,
  activityChkDetail: {},
  actchkextra: {},

  queue: [],
  queueTotal: 0,
  queueDetail: {},
  queueextra: {},

  activity: [],
  activityTotal: 0,
  activityDetail: {},
  actextra: {},

  actChkFind: {},
};
export const actactchkfind = createAsyncThunk(
  "activity/actchkactactfind",
  async (data: any) => {
    const response = await actchkactactfind(data);
    return response;
  }
)
export const fetchActChkList = createAsyncThunk(
  "actChkl/fetchActChkList",
  async (data: any) => {
    const response = await actChkList(data);
    return response;
  }
);

export const fetchActChkDetail = createAsyncThunk(
  "actChkl/fetchActChkDetail",
  async (data: any) => {
    const response = await actChkDetail(data);
    return response;
  }
);

export const getManageActChk = createAsyncThunk(
  "actChkl/getManageActChk",
  async (data: any) => {
    const response = await manageActChk(data);
    return response;
  }
);

export const getRemoveActChk = createAsyncThunk(
  "actChkl/getRemoveAct",
  async (data: any) => {
    const response = await deleteActChk(data);
    return response;
  }
);

export const fetchActActList = createAsyncThunk(
  "actAct/fetchActActList",
  async (data: any) => {
    const response = await actActList(data);
    return response;
  }
);

export const fetchActActDetail = createAsyncThunk(
  "actAct/fetchActActDetail",
  async (data: any) => {
    const response = await actActDetail(data);
    return response;
  }
);

export const getManageActAct = createAsyncThunk(
  "actAct/getManageActAct",
  async (data: any) => {
    const response = await manageActAct(data);
    return response;
  }
);

export const getRemoveActAct = createAsyncThunk(
  "actAct/getRemoveAct",
  async (data: any) => {
    const response = await deleteActAct(data);
    return response;
  }
);

export const fetchActList = createAsyncThunk(
  "activity/fetchActList",
  async (data: any) => {
    const response = await actList(data);
    return response;
  }
);

export const fetchActDetail = createAsyncThunk(
  "activity/fetchActDetail",
  async (data: any) => {
    const response = await actDetail(data);
    return response;
  }
);

export const getManageAct = createAsyncThunk(
  "activity/getManageAct",
  async (data: any) => {
    const response = await manageAct(data);
    return response;
  }
);

export const getRemoveAct = createAsyncThunk(
  "activity/getRemoveAct",
  async (data: any) => {
    const response = await deleteAct(data);
    return response;
  }
);

export const fetchQueueList = createAsyncThunk(
  "queue/fetchQueueList",
  async (data: any) => {
    const response = await queueList(data);
    return response;
  }
);

export const fetchQueueDetail = createAsyncThunk(
  "queue/fetchQueueDetail",
  async (data: any) => {
    const response = await queueDetail(data);
    return response;
  }
);

export const getManageQueue = createAsyncThunk(
  "queue/getManageQueue",
  async (data: any) => {
    const response = await manageQueue(data);
    return response;
  }
);

export const getRemoveQueue = createAsyncThunk(
  "queue/getRemoveQueue",
  async (data: any) => {
    const response = await deleteQueue(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    setResetQueueDetail: (state) => {
      state.queueDetail = {};
    },
    setResetActivityDetail: (state) => {
      state.activityDetail = {};
    },
    setResetActChkDetail: (state) => {
      state.activityChkDetail = {};
    },
    setResetActActDetail: (state) => {
      state.activityActDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActActList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.activityAct = action.payload?.message?.data;
          state.activityActTotal = action.payload?.message?.total || 10;
          state.actactextra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchActActDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.activityActDetail = action.payload?.message;
        }
      })
      .addCase(fetchActChkList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.activityChk = action.payload?.message?.data;
          state.activityChkTotal = action.payload?.message?.total || 10;
          state.actchkextra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchActChkDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.activityChkDetail = action.payload?.message;
        }
      })
      .addCase(fetchActList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.activity = action.payload?.message?.data;
          state.activityTotal = action.payload?.message?.total || 10;
          state.actextra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchActDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.activityDetail = action.payload?.message;
        }
      })
      .addCase(fetchQueueList.fulfilled, (state, action) => {
        state.queue = action.payload?.message?.data
        state.queueTotal = action.payload?.message?.total
        state.queueextra = action.payload?.message?.extra;
      })
      .addCase(fetchQueueDetail.fulfilled, (state, action) => {
        state.queueDetail = action.payload?.message
      })
      .addCase(actactchkfind.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.actChkFind = action.payload?.message;
        }
      });
  },
});

export const selectActChks = (state: AppState) =>
  state.queue?.activityChk;
export const selectActChkTotal = (state: AppState) =>
  state.queue?.activityChkTotal;
export const selectActChk = (state: AppState) =>
  state.queue?.activityChkDetail; //detail
export const selectactchkExtra = (state: AppState) => state.queue?.actchkextra;


export const selectActActs = (state: AppState) =>
  state.queue?.activityAct;
export const selectActActTotal = (state: AppState) =>
  state.queue?.activityActTotal;
export const selectActAct = (state: AppState) =>
  state.queue?.activityActDetail; //detail
export const selectactactExtra = (state: AppState) => state.queue?.actactextra;


export const selectactivitys = (state: AppState) =>
  state.queue?.activity;
export const selectactivityTotal = (state: AppState) =>
  state.queue?.activityTotal;
export const selectactivity = (state: AppState) =>
  state.queue?.activityDetail; //detail
export const selectactivityExtra = (state: AppState) => state.queue?.actextra;

export const selectqueues = (state: AppState) =>
  state.queue?.queue;
export const selectqueueTotal = (state: AppState) =>
  state.queue?.queueTotal;
export const selectqueue = (state: AppState) =>
  state.queue?.queueDetail; //detail
export const selectqueueExtra = (state: AppState) => state.queue?.queueextra;

export const chkFind = (state: AppState) =>
  state.queue?.actChkFind;
export default reducerSlice.reducer;

export const { setResetQueueDetail } =
  reducerSlice.actions;
export const { setResetActivityDetail } =
  reducerSlice.actions;
export const { setResetActChkDetail } =
  reducerSlice.actions;
export const { setResetActActDetail } =
  reducerSlice.actions;
