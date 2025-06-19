import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
//::;
import staffs from "./staff/slice";
import merchants from "./merchant/slice";
//::;
import app from "./app/slice";
import dashboard from "./dashboard/slice";
import user from "./user/slice";
import accessibility from "./accessibility/slice";
import functions from "./functions/slice";
import generalParam from "./generalParam/slice";
import adminAccounts from "./adminAccounts/slice";
import tranCodes from "./tranCode/slice";
import roleCodes from "./role/slice";
import credAppLims from "./credAppLim/slice";

import passwordPolicy from "./passwordPolicy/slice";
import backupDatabase from "./backup/slice";
import application from "./application/slice";

import fileManagement from "./fileManage/slice";
import tableKey from "./tableKey/slice";
import entity from "./entity/slice";
import request from "./request/slice";
import loancalculator from "./loanCalculator/slice";
import loanAccount from "./accountManagement/slice";

import reports from './reports/slice';
import rewards from './reward/slice';
import member from './member/slice';
import dsagent from './dsagent/slice';
import contract from './contract/slice';
import holiday from './holiday/slice';
import workday from './workday/slice';
import announcement from './announcement/slice';
import promotion from './promotion/slice';
import commission from './commission/slice';
import agent from './agentIncentive/slice';
import compars from './compar/slice';
import dealDate from './dealDate/slice';

export function makeStore() {
  return configureStore({
    reducer: {
      //::;
      staffs,
      merchants,
      //::;
      announcement,
      app,
      dashboard,
      user,
      accessibility,
      holiday,
      workday,
      dsagent,
      agent,
      functions,
      generalParam,
      adminAccounts,
    
      tranCodes,
      compars,
      roleCodes,
      credAppLims,
      fileManagement,
      tableKey,
      passwordPolicy,
      backupDatabase,
      application,
      entity,
      request,
      loancalculator,
      loanAccount,
     
      reports,
      rewards,
      member,
      promotion,
      contract,
      commission,
      dealDate,
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
