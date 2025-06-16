import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { accountDetail, accountDetailUpdate, listAccount, listAccountDetail, listAccountMessage, listAccountRelationship, listBilling, listCustomerRelationship, listTransaction, preCalculate, raiseRequest } from "./api";

export interface State {
  accountList: any[];
  accountTotal: number;
  accountDetailList: any[];
  accountDetailTotal: number;
  accountDetail: any;
  extra: any;
  accountDetailExtra: any;
  preCalculateResult: any;

  accountBillingList: any[];
  accountBillingTotal: number;
  accountBillingExtra: any;

  accountTransactionList: any[];
  accountTransactionTotal: number;
  accountTransactionExtra: any;

  accountCustomerRelationshipList: any[];
  accountCustomerRelationshipTotal: number;
  accountCustomerRelationshipExtra: any;

  accountRelationshipList: any[];
  accountRelationshipTotal: number;
  accountRelationshipExtra: any;

  accountMessageList: any[];
  accountMessageTotal: number;
  accountMessageExtra: any;
}

const initialState: State = {
  accountList: [],
  accountTotal: 0,
  accountDetailList: [],
  accountDetailTotal: 0,
  accountDetail: {},
  extra: {},
  accountDetailExtra: {},
  preCalculateResult: {},

  accountBillingList: [],
  accountBillingTotal: 0,
  accountBillingExtra: {},
  
  accountTransactionList: [],
  accountTransactionTotal: 0,
  accountTransactionExtra: {},

  accountCustomerRelationshipList: [],
  accountCustomerRelationshipTotal: 0,
  accountCustomerRelationshipExtra: {},

  accountRelationshipList: [],
  accountRelationshipTotal: 0,
  accountRelationshipExtra: {},

  accountMessageList: [],
  accountMessageTotal: 0,
  accountMessageExtra: {},
};

export const fetchLoanAccounts = createAsyncThunk(
  "account/fetchLoanAccounts",
  async (data: any) => {
    const response = await listAccount(data);
    return response;
  }
);

export const fetchLoanDetailsAccounts = createAsyncThunk(
  "account/fetchLoanDetailsAccounts",
  async (data: any) => {
    const response = await listAccountDetail(data);
    return response;
  }
);

export const fetchAccountDetail = createAsyncThunk(
  "account/fetchAccountDetail",
  async (data: any) => {
    const response = await accountDetail(data);
    return response;
  }
);

export const loanPreCalculate = createAsyncThunk(
  "account/loanPreCalculate",
  async (data: any) => {
    const response = await preCalculate(data);
    return response;
  }
);

export const fetchAccountBillings = createAsyncThunk(
  "account/fetchAccountBillings",
  async (data: any) => {
    const response = await listBilling(data);
    return response;
  }
);

export const fetchAccountTransactions = createAsyncThunk(
  "account/fetchAccountTransactions",
  async (data: any) => {
    const response = await listTransaction(data);
    return response;
  }
);

export const fetchAccountCustomerRelationships = createAsyncThunk(
  "account/fetchAccountCustomerRelationships",
  async (data: any) => {
    const response = await listCustomerRelationship(data);
    return response;
  }
);

export const fetchAccountRelationships = createAsyncThunk(
  "account/fetchAccountRelationships",
  async (data: any) => {
    const response = await listAccountRelationship(data);
    return response;
  }
);

export const fetchAccountMessages = createAsyncThunk(
  "account/fetchAccountMessages",
  async (data: any) => {
    const response = await listAccountMessage(data);
    return response;
  }
);

export const raiseManualTransactionRequest = createAsyncThunk(
  "account/raiseManualTransactionRequest",
  async (data: any) => {
    const response = await raiseRequest(data);
    return response;
  }
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async (data: any) => {
    const response = await accountDetailUpdate(data);
    return response;
  }
);

// export const getRemoveAdmin = createAsyncThunk(
//   "admins/remove",
//   async (data: any) => {
//     const response = await removeAdmin(data);
//     return response;
//   }
// );

// export const changeAdminPassword = createAsyncThunk(
//   "admins/changeAdminPassword",
//   async (data: any) => {
//     const response = await resetAdminPassword(data);
//     return response;
//   }
// );

export const reducerSlice = createSlice({
  name: "loanAccounts",
  initialState,
  reducers: {
    setResetLoanAccountsDetail: (state) => {
      state.accountDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoanAccounts.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountList = action.payload?.message?.data;
          state.accountTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchLoanDetailsAccounts.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountDetailList = action.payload?.message?.data;
          state.accountDetailTotal = action.payload?.message?.total || 10;
          state.accountDetailExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchAccountDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountDetail = action.payload?.message;
        }
      })
      .addCase(loanPreCalculate.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.preCalculateResult = action.payload?.message;
        }
      })
      .addCase(fetchAccountBillings.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountBillingList = action.payload?.message?.data;
          state.accountBillingTotal = action.payload?.message?.total || 10;
          state.accountBillingExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchAccountTransactions.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountTransactionList = action.payload?.message?.data;
          state.accountTransactionTotal = action.payload?.message?.total || 10;
          state.accountTransactionExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchAccountRelationships.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountRelationshipList = action.payload?.message?.data;
          state.accountRelationshipTotal = action.payload?.message?.total || 10;
          state.accountRelationshipExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchAccountCustomerRelationships.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountCustomerRelationshipList = action.payload?.message?.data;
          state.accountCustomerRelationshipTotal = action.payload?.message?.total || 10;
          state.accountCustomerRelationshipExtra = action.payload?.message?.extra;
        }
      })
      .addCase(fetchAccountMessages.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.accountMessageList = action.payload?.message?.data;
          state.accountMessageTotal = action.payload?.message?.total || 10;
          state.accountMessageExtra = action.payload?.message?.extra;
        }
      });
  },
});

export const { setResetLoanAccountsDetail } =
  reducerSlice.actions;

export const selectLoanAccounts = (state: AppState) =>
  state.loanAccount?.accountList;
export const selectLoanAccountsTotal = (state: AppState) =>
  state.loanAccount?.accountTotal;
export const selectLoanAccount = (state: AppState) =>
  state.loanAccount?.accountDetail;
export const selectExtra = (state: AppState) => state.loanAccount?.extra;

export const selectLoanDetailsAccounts = (state: AppState) =>
  state.loanAccount?.accountDetailList;
export const selectLoanDetailsAccountsTotal = (state: AppState) =>
  state.loanAccount?.accountDetailTotal;
export const selectLoanDetailsAccountExtra = (state: AppState) => state.loanAccount?.accountDetailExtra;
export const selectLoanPreCalculateResult = (state: AppState) => state.loanAccount?.preCalculateResult;

export const selectBillingsAccount = (state: AppState) =>
  state.loanAccount?.accountBillingList;
export const selectBillingsAccountTotal = (state: AppState) =>
  state.loanAccount?.accountBillingTotal;
export const selectBillingsAccountExtra = (state: AppState) => state.loanAccount?.accountBillingExtra;

export const selectAccountTransaction = (state: AppState) =>
  state.loanAccount?.accountTransactionList;
export const selectAccountTransactionTotal = (state: AppState) =>
  state.loanAccount?.accountTransactionTotal;
export const selectAccountTransactionExtra = (state: AppState) => state.loanAccount?.accountTransactionExtra;

export const selectCustomerRelationships = (state: AppState) =>
  state.loanAccount?.accountCustomerRelationshipList;
export const selectCustomerRelationshipTotal = (state: AppState) =>
  state.loanAccount?.accountCustomerRelationshipTotal;
export const selectCustomerRelationshipExtra = (state: AppState) => state.loanAccount?.accountCustomerRelationshipExtra;

export const selectAccountRelationships = (state: AppState) =>
  state.loanAccount?.accountRelationshipList;
export const selectAccountRelationshipsTotal = (state: AppState) =>
  state.loanAccount?.accountRelationshipTotal;
export const selectAccountRelationshipsExtra = (state: AppState) => state.loanAccount?.accountRelationshipExtra;

export const selectAccountMessages = (state: AppState) =>
  state.loanAccount?.accountMessageList;
export const selectAccountMessagesTotal = (state: AppState) =>
  state.loanAccount?.accountMessageTotal;
export const selectAccountMessagesExtra = (state: AppState) => state.loanAccount?.accountMessageExtra;


export default reducerSlice.reducer;