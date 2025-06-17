import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MouseEventHandler } from 'react';
import type { AppState, AppThunk } from '../store';
import { ddlRoleCode, ddlGlacpf, ddlTaxpar, ddlAction, downloadDocument, ddlFeeCode, ddl, ddlDsagent, ddlPriceCode, ddlTransCode, forgot_password, home, listMaintlog, login, uploadBulkFile, uploadFile, ddlTableKeys, listSubFileMaintlog, ddlEntity, ddlProdCode, ddlActWrkGrp, ddlChkMkrParam, ddlUser, ddlWorkgroups, ddlEntityBank, notificationMetadata, notificationGroupDDL, ddlChannelSender, ddlCustomer, ddlAgent, ddlProduct, ddlCompany, ddlCurrency, ddlMchuser } from './api';
import { StepStatus } from '@chakra-ui/react';


type modalAction = {
  title: string
  isClose?: boolean //for close button
  onClick?: MouseEventHandler<HTMLButtonElement>
  props?: any
}

export interface State {
  globalModal: boolean;
  globalModalTitle: string;
  globalModalMessage: string;
  globalModalStatus: "info" | "warning" | "success" | "error" | "custom";
  globalModalActions: modalAction[];
  version: string;
  token: string;
  refresh: string;
  isLogined: boolean;
  ddl: any;
  maintLogs: any[];
  maintExtra: any;
  maintTotal: number;
  tableRefreshCount: number;
  home: any;
  transCode: any[];
  priceCode: any[];
  prodCode: any[];
  showHide: boolean;
  breadcrumbInfo: any[];
  sideBarRoot: string;
  feeCode: any[];
  glacpf: any[];
  taxpar: any[];
  dsagent: any[];
  roleCode: any[];
  actWrkGrp: any[];
  actions: any[];
  tableKeys: any[];
  subMaintLogs: any[];
  subMaintTotal: number;
  entities: any[];
  chkMkr: any[];
  user: any[]
  workgroups: any[]

  entitybanks: any[];
  notMetadata: any[];
  extraDataField: any[];
  ddlNotGroup: any;
  ddlChannelSender: any[];
  customer: any[];
  product: any[];
  agent: any[];
  companies: any[];
  currencies: any[];
  mchUser: any[];
}

const initialState: State = {
  subMaintTotal: 0,
  subMaintLogs: [],
  globalModal: false,
  globalModalTitle: "",
  globalModalMessage: "",
  globalModalStatus: "success",
  globalModalActions: [],
  version: '',
  token: '',
  refresh: '',
  isLogined: false,
  ddl: {},
  mchUser: [],
  maintLogs: [],
  feeCode: [],
  glacpf: [],
  taxpar: [],
  dsagent: [],
  roleCode: [],
  actWrkGrp: [],
  maintTotal: 0,
  tableRefreshCount: 0,
  home: {},
  transCode: [],
  priceCode: [],
  prodCode: [],
  showHide: false,
  breadcrumbInfo: [],
  sideBarRoot: "",
  tableKeys: [],
  entities: [],
  actions: [],
  chkMkr: [],
  user: [],
  workgroups: [],
  entitybanks: [],
  notMetadata: [],
  extraDataField: [],
  ddlNotGroup: {},
  ddlChannelSender: [],
  customer: [],
  product: [],
  agent: [],
  companies: [],
  currencies: [],
  maintExtra: undefined
};
export const fetchDDLCheckerMaker = createAsyncThunk(
  "app/fetchDDLCheckerMaker",
  async (data: any) => {
    const response = await ddlChkMkrParam(data);
    return response;
  }
);
export const fetchDDLWorkgroup = createAsyncThunk(
  "app/fetchDDLWorkgroup",
  async (data: any) => {
    const response = await ddlWorkgroups(data);
    return response;
  }
);
export const postLogin = createAsyncThunk(
  'app/postLogin',
  async (data: any = {}) => {
    try {
      const response = await login(data);
      return response;
    } catch (e: any) {
      return false;
    }
  }
);

export const fetchCompanies = createAsyncThunk(
  "app/fetchCompanies",
  async (data: any) => {
    const response = await ddlCompany(data);
    return response;
  }
);
export const fetchSubFileMaintlogs = createAsyncThunk(
  "app/fetchSubFileMaintlogs",
  async (data: any) => {
    const response = await listSubFileMaintlog(data);
    return response;
  }
);

export const fetchDDLMchuser = createAsyncThunk(
  "app/fetchDDLMchuser",
  async (data: any) => {
    const response = await ddlMchuser(data);
    return response;
  }
);

export const fetchDDLTableKeys = createAsyncThunk(
  "app/fetchDDLTableKeys",
  async (data: any) => {
    const response = await ddlTableKeys(data);
    return response;
  }
);
export const download = createAsyncThunk(
  "app/download",
  async (data: any) => {
    const response = await downloadDocument(data);
    return response;
  }
);
export const fetchDDL = createAsyncThunk(
  "app/fetchDDL",
  async (data: any) => {
    const response = await ddl(data);
    return response;
  }
);

export const fetchDDLTransCode = createAsyncThunk(
  "app/fetchDDLTransCode",
  async (data: any) => {
    const response = await ddlTransCode(data);
    return response;
  }
);

export const fetchDDLPriceCode = createAsyncThunk(
  "app/fetchDDLPriceCode",
  async (data: any) => {
    const response = await ddlPriceCode(data);
    return response;
  }
);

export const fetchDDLProdCode = createAsyncThunk(
  "app/fetchDDLProdCode",
  async (data: any) => {
    const response = await ddlProdCode(data);
    return response;
  }
);

export const fetchDDLProduct = createAsyncThunk(
  "app/fetchDDLProduct",
  async (data: any) => {
    const response = await ddlProduct(data);
    return response;
  }
);
export const fetchDDLAgent = createAsyncThunk(
  "app/fetchDDLAgent",
  async (data: any) => {
    const response = await ddlAgent(data);
    return response;
  }
);

export const fetchDDLFeeCode = createAsyncThunk(
  "app/fetchDDLFeeCode",
  async (data: any) => {
    const response = await ddlFeeCode(data);
    return response;
  }
);

export const fetchDDLGlacpf = createAsyncThunk(
  "app/fetchDDLGlacpf",
  async (data: any) => {
    const response = await ddlGlacpf(data);
    return response;
  }
);

export const fetchDDLTaxpar = createAsyncThunk(
  "app/fetchDDLTaxpar",
  async (data: any) => {
    const response = await ddlTaxpar(data);
    return response;
  }
);

export const fetchDDLDsagent = createAsyncThunk(
  "app/fetchDDLDsagent",
  async (data: any) => {
    const response = await ddlDsagent(data);
    return response;
  }
);
export const fetchDDLEntity = createAsyncThunk(
  "app/fetchDDLEntity",
  async (data: any) => {

    const response = await ddlEntity(data);
    return response;
  }
);

export const fetchDDLRoleCode = createAsyncThunk(
  "app/fetchDDLRoleCode",
  async (data: any) => {
    const response = await ddlRoleCode(data);
    return response;
  }
);

export const fetchDDLActWrkGrp = createAsyncThunk(
  "app/fetchDDLActWrkGrp",
  async (data: any) => {
    const response = await ddlActWrkGrp(data);
    return response;
  }
);

export const fetchMaintlogs = createAsyncThunk(
  "app/maintlog",
  async (data: any) => {
    const response = await listMaintlog(data);
    return response;
  }
);

export const fetchHomeApi = createAsyncThunk(
  'app/home',
  async () => {
    const response = await home()
    return response
  }
)

export const postUploadFile = createAsyncThunk(
  'app/uploadFile',
  async (data: any) => {
    const response = await uploadFile(data)
    return response
  }
)

export const postBulkUploadFile = createAsyncThunk(
  'app/postBulkUploadFile',
  async (data: any) => {
    const response = await uploadBulkFile(data)
    return response
  }
)

export const postForgotPW = createAsyncThunk(
  'app/postForgotPW',
  async (data: any = {}) => {
    const response = await forgot_password(data);
    return response;
  }
);
export const fetchDDLAction = createAsyncThunk(
  'app/fetchDDLAction',
  async (data: any = {}) => {
    const response = await ddlAction(data);
    return response;
  }
);
export const fetchDDLUser = createAsyncThunk(
  "app/fetchDDLUser",
  async (data: any) => {
    const response = await ddlUser(data);
    return response;
  }
);

export const fetchDDLEntityBank = createAsyncThunk(
  "app/fetchDDLEntityBank",
  async (data: any) => {
    const response = await ddlEntityBank(data);
    return response;
  }
);

export const fetchMetadata = createAsyncThunk(
  "app/fetchMetadata",
  async (data: any) => {
    const response = await notificationMetadata(data);
    return response;
  }
);

export const fetchExtraDataField = createAsyncThunk(
  "app/fetchExtraDataField",
  async (data: any) => {
    const response = await notificationMetadata(data);
    return response;
  }
);

export const ddlNotificationGroup = createAsyncThunk(
  "app/ddlNotificationGroup",
  async (data: any) => {
    const response = await notificationGroupDDL(data);
    return response;
  }
);

export const fetchDDLChannelSender = createAsyncThunk(
  "app/fetchDDLChannelSender",
  async (data: any) => {
    const response = await ddlChannelSender(data);
    return response;
  }
);

export const fetchDDLCustomer = createAsyncThunk(
  "app/fetchDDLCustomer",
  async (data: any) => {
    const response = await ddlCustomer(data);
    return response;
  }
);
export const fetchCurrencies = createAsyncThunk(
  "app/fetchCurrencies",
  async (data: any) => {
    const response = await ddlCurrency(data);
    return response;
  }
);

// export const postRegister = createAsyncThunk(
//   'app/postRegister',
//   async (data: any = {}) => {
//     const response = await register(data);
//     return response;
//   }
// );

export const reducerSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openGlobalModal: (state, action: PayloadAction<{
      title: string
      message: any
      status: "info" | "warning" | "success" | "error" | "custom"
      actions: modalAction[]
    }>) => {
      state.globalModal = true;
      state.globalModalTitle = action?.payload?.title;
      state.globalModalMessage = action?.payload?.message;
      state.globalModalStatus = action?.payload?.status || "success";
      state.globalModalActions = action?.payload?.actions || [];
    },
    closeGlobalModal: (state) => {
      state.globalModal = false;
      state.globalModalTitle = "";
      state.globalModalMessage = "";
      state.globalModalStatus = "success";
      state.globalModalActions = [];
    },
    restoreUserSession: (state) => {
      const AUTH_TOKEN = localStorage.getItem('AUTH_TOKEN');
      const AUTH_REFRESH = localStorage.getItem('AUTH_REFRESH');
      const AUTH_USERID = localStorage.getItem('AUTH_USERID');

      state.isLogined = true;
      state.token = AUTH_TOKEN || '';
      state.refresh = AUTH_REFRESH || '';
    },
    logout: (state) => {
      state.isLogined = false;
      state.token = '';
      state.refresh = '';
      state.showHide = false;
      state.breadcrumbInfo = [];
      state.sideBarRoot = "Dashboard";
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('AUTH_REFRESH');
    },
    refreshTable: (state) => {
      state.tableRefreshCount = ++state.tableRefreshCount;
    },
    resetRefreshTable: (state) => {
      state.tableRefreshCount = 0;
    },
    setSideBarShowHide: (state, action) => {
      state.showHide = action?.payload;
    },
    setBreadcrumbsInfo: (state, action) => {
      state.breadcrumbInfo = action?.payload;
    },

    setSideBarRoot: (state, action) => {
      state.sideBarRoot = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        postLogin.fulfilled, (state, action) => {
          if (action.payload.httpCode < 400) {
            const token = action.payload.message?.token;
            const refresh = action.payload?.content?.Token.refresh;
            const userId = action.payload?.content?.UserID;
            state.token = token;
            state.refresh = token;
            state.isLogined = action.payload.message?.token ? true : false;
            localStorage.setItem('AUTH_TOKEN', token);
            localStorage.setItem('AUTH_REFRESH', refresh);
          }
        })
      .addCase(
        fetchDDL.fulfilled, (state, action) => {
          if (action.payload.httpCode < 400) {
            state.ddl = {
              ...state.ddl,
              [action.payload.ddlKey]: action.payload?.message || []
            }
          }
        })
      .addCase(fetchMaintlogs.fulfilled, (state, action) => {
        state.maintLogs = action.payload?.message?.data
        state.maintTotal = action.payload?.message?.total
        state.maintExtra = action.payload?.message?.extra

      })
      .addCase(fetchDDLUser.fulfilled, (state, action) => {
        state.user = action.payload?.message?.data
      })
      .addCase(fetchDDLCheckerMaker.fulfilled, (state, action) => {
        state.chkMkr = action.payload?.message?.data
      })
      .addCase(fetchHomeApi.fulfilled, (state, action) => {
        state.home = action.payload?.message
      })
      .addCase(fetchDDLMchuser.fulfilled, (state, action) => {
        state.mchUser = action.payload?.message.data
      })
      .addCase(fetchDDLTransCode.fulfilled, (state, action) => {
        // Check if action.payload and action.payload.message are defined
        if (action.payload && action.payload.message && action.payload.message.data) {
          state.transCode = action.payload.message.data;
        } else {
          console.error('Unexpected payload structure:', action.payload);
          // Handle the case where the expected structure is not met
          state.transCode = []; // or whatever default state you prefer
        }
      })
      .addCase(fetchDDLPriceCode.fulfilled, (state, action) => {
        state.priceCode = action.payload?.message.data
      })
      .addCase(fetchDDLProdCode.fulfilled, (state, action) => {
        state.prodCode = action.payload?.message.data
      })
      .addCase(fetchDDLFeeCode.fulfilled, (state, action) => {
        state.feeCode = action.payload?.message.data
      })

      .addCase(fetchDDLGlacpf.fulfilled, (state, action) => {
        state.glacpf = action.payload?.message.data
      })
      .addCase(fetchDDLTaxpar.fulfilled, (state, action) => {
        state.taxpar = action.payload?.message.data
      })

      .addCase(fetchDDLDsagent.fulfilled, (state, action) => {
        // state.dsagent = action.payload?.message.data
        if (action.payload && action.payload.message && action.payload.message.data) {
          state.dsagent = action.payload.message.data;
        } else {
          console.error('Unexpected payload structure:', action.payload);
          // Handle the case where the expected structure is not met
          state.dsagent = []; // or whatever default state you prefer
        }
      })

      .addCase(fetchDDLRoleCode.fulfilled, (state, action) => {
        state.roleCode = action.payload?.message?.data
        // state.roleCode = action.payload?.message.data
        if (action.payload && action.payload.message && action.payload.message.data) {
          state.roleCode = action.payload.message.data;
        } else {
          console.error('Unexpected payload structure:', action.payload);
          // Handle the case where the expected structure is not met
          state.roleCode = []; // or whatever default state you prefer
        }
      })
      .addCase(fetchDDLActWrkGrp.fulfilled, (state, action) => {
        state.actWrkGrp = action.payload?.message.data
      })

      .addCase(fetchDDLEntity.fulfilled, (state, action) => {
        state.entities = action.payload?.message.data
      })
      // .addCase(fetchDDLEntity.fulfilled, (state, action) => {
      //   state.entities = action.payload?.message.data
      // })
      // .addCase(fetchDDLActWrkGrp.fulfilled, (state, action) => {
      //   state.actWrkGrp = action.payload?.message.data
      // })  
      .addCase(fetchDDLTableKeys.fulfilled, (state, action) => {
        state.tableKeys = action.payload?.message
      })
      .addCase(fetchSubFileMaintlogs.fulfilled, (state, action) => {
        state.subMaintLogs = action.payload?.message?.data
        state.subMaintTotal = action.payload?.message?.total
      })
      .addCase(fetchDDLAction.fulfilled, (state, action) => {
        state.actions = action.payload?.message
      })
      .addCase(fetchDDLWorkgroup.fulfilled, (state, action) => {
        state.workgroups = action.payload?.message
      })
      .addCase(fetchDDLEntityBank.fulfilled, (state, action) => {
        state.entitybanks = action.payload?.message.data;
      })
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.notMetadata = action.payload?.message
      })
      .addCase(fetchExtraDataField.fulfilled, (state, action) => {
        state.extraDataField = action.payload?.message
      })
      .addCase(ddlNotificationGroup.fulfilled, (state, action) => {
        state.ddlNotGroup = action.payload?.message?.data
      })
      .addCase(fetchDDLChannelSender.fulfilled, (state, action) => {
        state.ddlChannelSender = action.payload?.message?.data
      })
      .addCase(fetchDDLCustomer.fulfilled, (state, action) => {
        state.customer = action.payload?.message?.data
      })
      .addCase(fetchDDLProduct.fulfilled, (state, action) => {
        state.product = action.payload?.message?.data
      })
      .addCase(fetchDDLAgent.fulfilled, (state, action) => {
        state.agent = action.payload?.message?.data
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload?.message?.data
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload?.message?.data
      })
  },
});

export const { restoreUserSession, logout, closeGlobalModal, openGlobalModal, refreshTable, resetRefreshTable, setSideBarShowHide, setBreadcrumbsInfo, setSideBarRoot } =
  reducerSlice.actions;

export const selectGlobalModal = (state: AppState) => state.app?.globalModal;
export const selectGlobalModalMessage = (state: AppState) => state.app?.globalModalMessage;
export const selectGlobalModalStatus = (state: AppState) => state.app?.globalModalStatus;
export const selectGlobalModalTitle = (state: AppState) => state.app?.globalModalTitle;
export const selectGlobalModalActions = (state: AppState) => state.app?.globalModalActions;
export const selectDDL = (state: AppState) => state.app?.ddl
export const selectTransCode = (state: AppState) => state.app?.transCode
export const selectPriceCode = (state: AppState) => state.app?.priceCode
export const selectProdCode = (state: AppState) => state.app?.prodCode
export const selectFeeCode = (state: AppState) => state.app?.feeCode
export const selectGlacpf = (state: AppState) => state.app?.glacpf
export const selectTaxpar = (state: AppState) => state.app?.taxpar
export const selectDsagent = (state: AppState) => state.app?.dsagent
export const selectRoleCode = (state: AppState) => state.app?.roleCode
export const selectActWrkGrp = (state: AppState) => state.app?.actWrkGrp
export const selectSubMaintLog = (state: AppState) => state.app?.subMaintLogs;
export const selectSubMaintTotal = (state: AppState) => state.app?.subMaintTotal;
export const selectEntities = (state: AppState) => state.app?.entities;
export const selectDDLChkMkr = (state: AppState) => state.app?.chkMkr;

export const selectToken = (state: AppState) => state.app?.token;
export const selectIsLogined = (state: AppState) => state.app?.isLogined;

export const selectMaintLog = (state: AppState) => state.app?.maintLogs;
export const selectMaintTotal = (state: AppState) => state.app?.maintTotal;

export const selectTableRefreshCount = (state: AppState) => state.app?.tableRefreshCount;
export const selectHome = (state: AppState) => state.app.home
export const selectUser = (state: AppState) => state.app?.user

export const selectShowHide = (state: AppState) => state.app.showHide;
export const selectBreadcrumbInfo = (state: AppState) => state.app.breadcrumbInfo;
export const selectSideBarRoot = (state: AppState) => state.app.sideBarRoot;
export const selectTableKeys = (state: AppState) => state.app?.tableKeys;
export const selectMaintExtra = (state: AppState) => state.app?.maintExtra;
export const selectActions = (state: AppState) => state.app?.actions;
export const selectWorkgroups = (state: AppState) => state.app?.workgroups;
export const selectEntityBanks = (state: AppState) => state.app?.entitybanks;

export const selectNotMetadata = (state: AppState) => state.app?.notMetadata;
export const selectExtraDataField = (state: AppState) => state.app?.extraDataField;
export const selectDDLNotificationGroup = (state: AppState) => state.app?.ddlNotGroup
export const selectChannelSender = (state: AppState) => state.app?.ddlChannelSender;
export const selectCustomer = (state: AppState) => state.app?.customer;
export const selectDDLAgent = (state: AppState) => state.app?.agent;
export const selectDDLProduct = (state: AppState) => state.app?.product;
export const selectDDLCompany = (state: AppState) => state.app?.companies;
export const selectDDLCurrency = (state: AppState) => state.app?.currencies;
export const selectMchuser = (state: AppState) => state.app?.mchUser;

export default reducerSlice.reducer;
