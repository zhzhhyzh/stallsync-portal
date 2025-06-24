import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
//::;

import app from "./app/slice";
import dashboard from "./dashboard/slice";
import user from "./user/slice";
import accessibility from "./accessibility/slice";
import functions from "./functions/slice";
import generalParam from "./generalParam/slice";
import adminAccounts from "./adminAccounts/slice";
import roleCodes from "./role/slice";
import passwordPolicy from "./passwordPolicy/slice";
import fileManagement from "./fileManage/slice";
import tableKey from "./tableKey/slice";

import staffs from "./staff/slice";
import merchants from "./merchant/slice";
import products from "./product/slice";
import productsR from "./inventory/slice";
import rewards from './reward/slice';
import holiday from './holiday/slice';
import workday from './workday/slice';
import announcement from './announcement/slice';
import mbrs from './mbrProfile/slice';
import reports from './reports/slice';
import order from './order/slice';

//::;

import tranCodes from "./tranCode/slice";

import backupDatabase from "./backup/slice";




export function makeStore() {
  return configureStore({
    reducer: {
      staffs,
      merchants,
      mbrs,
      announcement,
      app,
      dashboard,
      user,
      accessibility,
      holiday,
      workday,
      functions,
      generalParam,
      adminAccounts,
      products,
      productsR,
      roleCodes,
      fileManagement,
      tableKey,
      passwordPolicy,
      reports,
      rewards,

      tranCodes,
      order,
      backupDatabase,


    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
