import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { historyByNotTemplateDetail, listHistoryByAccount, listHistoryByCustomer, listHistoryByNotTemplate, listRecipients } from "./api";

export interface State {
  sentHistoryByTemplate: any[];
  sentHistoryByTemplateTotal: number;
  sentHistoryByTemplateDetail: any;
  sentHistoryByTemplateExtra: any;

  sentHistoryByCustomer: any[];
  sentHistoryByCustomerTotal: number;
  sentHistoryByCustomerDetail: any;
  sentHistoryByCustomerExtra: any;

  sentHistoryRecipients: any[];
  sentHistoryRecipientsTotal: number;
  sentHistoryRecipientsExtra: any;

  sentHistoryByAccount: any[];
  sentHistoryByAccountTotal: number;
  sentHistoryByAccountDetail: any;
  sentHistoryByAccountExtra: any;
}

const initialState: State = {
  sentHistoryByTemplate: [],
  sentHistoryByTemplateTotal: 0,
  sentHistoryByTemplateDetail: {},
  sentHistoryByTemplateExtra: {},

  sentHistoryByCustomer: [],
  sentHistoryByCustomerTotal: 0,
  sentHistoryByCustomerDetail: {},
  sentHistoryByCustomerExtra: {},

  sentHistoryRecipients: [],
  sentHistoryRecipientsTotal: 0,
  sentHistoryRecipientsExtra: {},

  sentHistoryByAccount: [],
  sentHistoryByAccountTotal: 0,
  sentHistoryByAccountDetail: {},
  sentHistoryByAccountExtra: {},
};

export const fetchHistoriesByTemplate = createAsyncThunk(
  "senthistory/fetchHistoriesByTemplate",
  async (data: any) => {
    const response = await listHistoryByNotTemplate(data);
    return response;
  }
);

export const fetchHistoriesByTemplateDetail = createAsyncThunk(
  "senthistory/fetchHistoriesByTemplateDetail",
  async (data: any) => {
    const response = await historyByNotTemplateDetail(data);
    return response;
  }
);

export const fetchHistoriesByCustomer = createAsyncThunk(
  "senthistory/fetchHistoriesByCustomer",
  async (data: any) => {
    const response = await listHistoryByCustomer(data);
    return response;
  }
);

export const fetchRecipients = createAsyncThunk(
  "senthistory/fetchRecipients",
  async (data: any) => {
    const response = await listRecipients(data);
    return response;
  }
);

export const fetchHistoriesByAccount = createAsyncThunk(
  "senthistory/fetchHistoriesByAccount",
  async (data: any) => {
    const response = await listHistoryByAccount(data);
    return response;
  }
);

// export const fetchHistoriesByAccountDetail = createAsyncThunk(
//   "senthistory/fetchHistoriesByAccountDetail",
//   async (data: any) => {
//     const response = await historyByAccountDetail(data);
//     return response;
//   }
// );

export const reducerSlice = createSlice({
  name: "sentHistory",
  initialState,
  reducers: {
    setResetSentHistoryByTemplateDetail: (state) => {
      state.sentHistoryByTemplateDetail = {};
    },
    setResetSentHistoryByCustomerDetail: (state) => {
      state.sentHistoryByCustomerDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoriesByTemplate.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sentHistoryByTemplate = action.payload?.message?.data;
          state.sentHistoryByTemplateTotal = action.payload?.message?.total || 10;
          state.sentHistoryByTemplateExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchHistoriesByCustomer.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sentHistoryByCustomer = action.payload?.message?.data;
          state.sentHistoryByCustomerTotal = action.payload?.message?.total || 10;
          state.sentHistoryByCustomerExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchHistoriesByTemplateDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sentHistoryByTemplateDetail = action.payload?.message;
        }
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sentHistoryRecipients = action.payload?.message?.data;
          state.sentHistoryRecipientsTotal = action.payload?.message?.total || 10;
          state.sentHistoryRecipientsExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchHistoriesByAccount.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.sentHistoryByAccount = action.payload?.message?.data;
          state.sentHistoryByAccountTotal = action.payload?.message?.total || 10;
          state.sentHistoryByAccountExtra = action.payload?.message?.extra;
        }
      });
      // .addCase(fetchHistoriesByAccountDetail.fulfilled, (state, action) => {
      //   if (action.payload.httpCode < 400) {
      //     state.sentHistoryByAccountDetail = action.payload?.message;
      //   }
      // })
      
  },
});

export const { setResetSentHistoryByTemplateDetail, setResetSentHistoryByCustomerDetail } =
  reducerSlice.actions;

export const selectSentHistoriesByTemplate = (state: AppState) =>
  state.notSentHistory?.sentHistoryByTemplate;
export const selectSentHistoriesByTemplateTotal = (state: AppState) =>
  state.notSentHistory?.sentHistoryByTemplateTotal;
export const selectSentHistoryByTemplate = (state: AppState) =>
  state.notSentHistory?.sentHistoryByTemplateDetail;
export const selectSentHistoriesByTemplateExtra = (state: AppState) => state.notSentHistory?.sentHistoryByTemplateExtra;

export const selectSentHistoriesByCustomer = (state: AppState) =>
  state.notSentHistory?.sentHistoryByCustomer;
export const selectSentHistoriesByCustomerTotal = (state: AppState) =>
  state.notSentHistory?.sentHistoryByCustomerTotal;
export const selectSentHistoryByCustomer = (state: AppState) =>
  state.notSentHistory?.sentHistoryByCustomerDetail;
export const selectSentHistoriesByCustomerExtra = (state: AppState) => state.notSentHistory?.sentHistoryByCustomerExtra;

export const selectSentHistoriesRecipients = (state: AppState) =>
  state.notSentHistory?.sentHistoryRecipients;
export const selectSentHistoriesRecipientsTotal = (state: AppState) =>
  state.notSentHistory?.sentHistoryRecipientsTotal;
export const selectSentHistoriesRecipientsExtra = (state: AppState) => state.notSentHistory?.sentHistoryRecipientsExtra;

export const selectSentHistoriesByAccount = (state: AppState) =>
  state.notSentHistory?.sentHistoryByAccount;
export const selectSentHistoriesByAccountTotal = (state: AppState) =>
  state.notSentHistory?.sentHistoryByAccountTotal;
// export const selectSentHistoryByAccount = (state: AppState) =>
//   state.notSentHistory?.sentHistoryByAccountDetail;
export const selectSentHistoriesByAccountExtra = (state: AppState) => state.notSentHistory?.sentHistoryByAccountExtra;


export default reducerSlice.reducer;