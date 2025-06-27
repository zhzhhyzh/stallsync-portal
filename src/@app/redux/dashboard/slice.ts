import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '../store'
import { getMain, getTop10 } from './api'

export interface State {
    numberBoard: any[];
    orderChart: any[];
    top10Agents: any[];
    applications: any[];
    totalSales: any[];
}

const initialState: State = {
    numberBoard: [],
    orderChart: [],
    top10Agents: [],
    applications: [],
    totalSales: [],

}

export const fetchMain = createAsyncThunk(
    'app/fetchMain',
    async (data: any) => {
        const response = await getMain(data)
        return response
    }
)

export const fetchTop10 = createAsyncThunk(
    'app/fetchTop10',
    async (data: any) => {
        const response = await getTop10(data)
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
                state.numberBoard = action.payload?.message?.numberBoard
                state.totalSales = action.payload?.message?.salesChart
                state.orderChart = action.payload?.message?.orderChart
                state.top10Agents = action.payload?.message?.top10Agents
            })

            .addCase(fetchTop10.fulfilled, (state, action) => {

                state.top10Agents = action.payload?.message?.top10Agents
            })
    },
})

export const { clearDashboardData } = reducerSlice.actions

export const selectApplications = (state: AppState) => state.dashboard?.applications
export const selectTotalSales = (state: AppState) => state.dashboard?.totalSales
export const selectorderChart = (state: AppState) => state.dashboard?.orderChart
export const selectMemberTiers = (state: AppState) => state.dashboard?.numberBoard
export const selecTop10Agents = (state: AppState) => state.dashboard?.top10Agents

export default reducerSlice.reducer