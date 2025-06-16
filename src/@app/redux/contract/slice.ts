import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { manageContract, removeContract, contractDetail, contractList, contractDocList, contractDocDetail, managecontractDoc, removecontractDoc } from "./api";

export interface State {
  contracts: any[]; //list
  contractsTotal: number;
  contract: any; //detail
  extra: any;
  contractDocs: any[]
  contractDoc: any
  contractDocsTotal: number
}

const initialState: State = {
  contracts: [],
  contractsTotal: 0,
  contract: {},
  extra: {},
  contractDocs: [],
  contractDoc:{},
  contractDocsTotal: 0
};

export const getContractDocList = createAsyncThunk(
  "contract/getContractDocList",
  async (data: any) => {
    const response = await contractDocList(data);
    return response;
  }
);

export const getContractDocDetail = createAsyncThunk(
  "contract/getContractDocDetail",
  async (data: any) => {
    const response = await contractDocDetail(data);
    return response;
  }
);

export const getManageContractDoc = createAsyncThunk(
  "contract/getManageContractDoc",
  async (data: any) => {
    const response = await managecontractDoc(data);
    return response;
  }
);

export const getRemoveContractDoc = createAsyncThunk(
  "contract/getRemoveContractDoc",
  async (data: any) => {
    const response = await removecontractDoc(data);
    return response;
  }
);

export const getContractList = createAsyncThunk(
  "contract/getContractList",
  async (data: any) => {
    const response = await contractList(data);
    return response;
  }
);

export const getContractDetail = createAsyncThunk(
  "contract/getContractDetail",
  async (data: any) => {
    const response = await contractDetail(data);
    return response;
  }
);

export const getManageContract = createAsyncThunk(
  "contract/getManageContract",
  async (data: any) => {
    const response = await manageContract(data);
    return response;
  }
);

export const getRemoveContract = createAsyncThunk(
  "contract/getRemoveContract",
  async (data: any) => {
    const response = await removeContract(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setResetContractDetail: (state) => {
      state.contract = {};
    },
    setResetContractDocDetail: (state) => {
      state.contractDoc = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContractList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.contracts = action.payload?.message?.data;
          state.contractsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getContractDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.contract = action.payload?.message;
        }
      })
      .addCase(getContractDocList.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.contractDocs = action.payload?.message?.data;
          state.contractDocsTotal = action.payload?.message?.total || 10;
          state.extra = action.payload?.message?.extra;
        }
      })
      .addCase(getContractDocDetail.fulfilled, (state, action) => {
        if (action.payload.httpCode < 400) {
          state.contractDoc = action.payload?.message;
        }
      });
  },
});

export const { setResetContractDetail, setResetContractDocDetail } =
  reducerSlice.actions;

export const selectContracts = (state: AppState) =>
  state.contract?.contracts;
export const selectContractsTotal = (state: AppState) =>
  state.contract?.contractsTotal;
export const selectContract = (state: AppState) =>{
  return state.contract?.contract;
}
export const selectExtra = (state: AppState) => state.contract?.extra;
export const selectContractDocs = (state: AppState) =>
  state.contract?.contractDocs;
export const selectContractDocsTotal = (state: AppState) =>
  state.contract?.contractDocsTotal;
export const selectContractDoc = (state: AppState) =>
  state.contract?.contractDoc;


export default reducerSlice.reducer;
