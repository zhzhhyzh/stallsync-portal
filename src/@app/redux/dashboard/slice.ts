import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '../store'
import { getMain, getTop10, getCommission, getSales } from './api'

export interface State {
    memberTiers: any[];
    totalCommission : any[];
    top10Agents: any[];
    applications: any[];
    totalSales: any[];
}

const initialState: State = {
    memberTiers: [],
    totalCommission: [],
    top10Agents: [],
    applications: [],
    totalSales: [],
    
}

export const fetchMain = createAsyncThunk(
    'app/fetchMain',
    async (data:any) => {
        const response = await getMain(data)
        return response
    }
)

export const fetchTop10 = createAsyncThunk(
    'app/fetchTop10',
    async (data:any) => {
        const response = await getTop10(data)
        return response
    }
)

export const fetchCommissions = createAsyncThunk(
    'app/fetchCommissions',
    async (data:any) => {
        const response = await getCommission(data)
        return response
    }
)

export const fetchSales = createAsyncThunk(
    'app/fetchSales',
    async (data:any) => {
        const response = await getSales(data)
        return response
    }
)


export const reducerSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardData: (state: any, action: PayloadAction<any>) => {
            for (const [key, value] of Object.entries(initialState)) {
                state[key] = value
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMain.fulfilled, (state, action) => {
                state.applications = action.payload?.message?.applications
                state.memberTiers = action.payload?.message?.memberTiers
                state.totalSales = action.payload?.message?.totalSales
                state.totalCommission = action.payload?.message?.totalCommission
                state.top10Agents = action.payload?.message?.top10Agents
            })
            .addCase(fetchCommissions.fulfilled, (state, action) => {
               
                state.totalCommission = action.payload?.message?.totalCommission
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
               
                state.totalSales = action.payload?.message?.totalSales
            })
  
            .addCase(fetchTop10.fulfilled, (state, action) => {
               
                state.top10Agents = action.payload?.message?.top10Agents
            })
    },
})

export const { clearDashboardData } = reducerSlice.actions

export const selectApplications = (state: AppState) => state.dashboard?.applications
export const selectTotalSales = (state: AppState) => state.dashboard?.totalSales
export const selectTotalCommission = (state: AppState) => state.dashboard?.totalCommission
export const selectMemberTiers = (state: AppState) => state.dashboard?.memberTiers
export const selecTop10Agents = (state: AppState) => state.dashboard?.top10Agents

export default reducerSlice.reducer