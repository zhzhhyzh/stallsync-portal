import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '../store'
import { getMain, getTopMerchants} from './api'

export interface State {
    numberBoard: any[];
    orderChart: any[];
    topMerchants: any[];
    applications: any[];
    totalSales: any[];
}

const initialState: State = {
    numberBoard: [],
    orderChart: [],
    topMerchants: [],
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

export const fetchTopMerchants = createAsyncThunk(
    'app/fetchTopMerchants',
    async (data: any) => {
        const response = await getTopMerchants(data)
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
                state.topMerchants = action.payload?.message?.topMerchants
            })

            .addCase(fetchTopMerchants.fulfilled, (state, action) => {

                state.topMerchants = action.payload?.message?.topMerchants
            })
    },
})

export const { clearDashboardData } = reducerSlice.actions

export const selectApplications = (state: AppState) => state.dashboard?.applications
export const selectTotalSales = (state: AppState) => state.dashboard?.totalSales
export const selectorderChart = (state: AppState) => state.dashboard?.orderChart
export const selectMemberTiers = (state: AppState) => state.dashboard?.numberBoard
export const selectTopMerchants = (state: AppState) => state.dashboard?.topMerchants

export default reducerSlice.reducer