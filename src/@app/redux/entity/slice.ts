import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "../store";
import { list, detail, addUpdate, remove, treeList } from "./api";

export interface State {
  entity: any[];
  entityTree: any;
  entityTotal: number;
  entityDetail: any;
  extra: any;

}

const initialState: State = {
  entity: [],
  entityTotal: 0,
  entityDetail: {},
  extra: {},
  entityTree: {},

};

export const fetchEntity = createAsyncThunk(
  "entity/fetchEntity",
  async (data: any) => {
    const response = await list(data);
    return response;
  }
);

export const fetchEntityDetail = createAsyncThunk(
  "entity/fetchEntityDetail",
  async (data: any) => {
    const response = await detail(data);
    return response;
  }
);
export const fetchEntityTreeList = createAsyncThunk(
  "entity/fetchEntityTreeList",
  async (data: any) => {
    const response = await treeList(data);
    return response;
  }
);

export const manageEntity = createAsyncThunk(
  "entity/manageEntity",
  async (data: any) => {
    const response = await addUpdate(data);
    return response;
  }
);

export const getRemoveEntity = createAsyncThunk(
  "entity/removeEntity",
  async (data: any) => {
    const response = await remove(data);
    return response;
  }
);

export const reducerSlice = createSlice({
  name: "entity",
  initialState,
  reducers: {
    setResetEntityDetail: (state) => {
      state.entityDetail = {};
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntity.fulfilled, (state, action) => {
        state.entity = action.payload?.message?.data
        
        state.entityTotal = action.payload?.message?.total
        state.extra = action.payload?.message?.extra;
      })
      .addCase(fetchEntityDetail.fulfilled, (state, action) => {
          state.entityDetail = action.payload?.message
      })
      .addCase(fetchEntityTreeList.fulfilled, (state, action) => {
        state.entityTree = action.payload?.message
        
      })
    
  },
});

export const { setResetEntityDetail } =
  reducerSlice.actions;

export const selectEntities = (state: AppState) => state.entity?.entity
export const selectEntity = (state: AppState) => state.entity?.entityDetail
export const selectEntityTree = (state: AppState) => state.entity?.entityTree
export const selectTotal = (state: AppState) => state.entity?.entityTotal
export const selectExtra = (state: AppState) => state.entity?.extra;


export default reducerSlice.reducer;