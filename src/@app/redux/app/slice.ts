import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MouseEventHandler } from 'react';
import type { AppState, AppThunk } from '../store';
import { ddlRoleCode, ddlMerchant, ddlAction, downloadDocument, ddl, forgot_password, home, listMaintlog, login, uploadBulkFile, uploadFile, ddlTableKeys, listSubFileMaintlog, ddlUser,   ddlMchuser, ddlAvluser } from './api';
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
  showHide: boolean;
  merchant: any[];
  breadcrumbInfo: any[];
  sideBarRoot: string;

  roleCode: any[];
  actions: any[];
  tableKeys: any[];
  subMaintLogs: any[];
  subMaintTotal: number;
  user: any[]

  extraDataField: any[];
  mchUser: any[];
  avluser: any[];
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
  merchant: [],
  roleCode: [],
  maintTotal: 0,
  tableRefreshCount: 0,
  home: {},
  showHide: false,
  breadcrumbInfo: [],
  sideBarRoot: "",
  tableKeys: [],
  actions: [],
  user: [],
  extraDataField: [],
  maintExtra: undefined,
  avluser: [],
};


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

export const fetchDDLAvluser = createAsyncThunk(
  "app/fetchDDLAvluser",
  async (data: any) => {
    const response = await ddlAvluser(data);
    return response;
  }
);

export const fetchDDLMerchant = createAsyncThunk(
  "app/fetchDDLMerchant",
  async (data: any) => {
    const response = await ddlMerchant(data);
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



export const fetchDDLRoleCode = createAsyncThunk(
  "app/fetchDDLRoleCode",
  async (data: any) => {
    const response = await ddlRoleCode(data);
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

      .addCase(fetchHomeApi.fulfilled, (state, action) => {
        state.home = action.payload?.message
      })
      .addCase(fetchDDLMchuser.fulfilled, (state, action) => {
        state.mchUser = action.payload?.message.data
      })

      .addCase(fetchDDLAvluser.fulfilled, (state, action) => {
        state.avluser = action.payload?.message.data
      })

      .addCase(fetchDDLMerchant.fulfilled, (state, action) => {
        state.merchant = action.payload?.message.data
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

export const selectRoleCode = (state: AppState) => state.app?.roleCode
export const selectSubMaintLog = (state: AppState) => state.app?.subMaintLogs;
export const selectSubMaintTotal = (state: AppState) => state.app?.subMaintTotal;

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

export const selectExtraDataField = (state: AppState) => state.app?.extraDataField;
export const selectMchuser = (state: AppState) => state.app?.mchUser;
export const selectAvluser = (state: AppState) => state.app?.avluser;
export const selectMerchant = (state: AppState) => state.app?.merchant;

export default reducerSlice.reducer;
