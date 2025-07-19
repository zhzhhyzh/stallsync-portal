export const API_ROUTES = {
  //DASHBOARD
  DASHBOARD_MAIN: "dashboard/main",
  DASHBOARD_TOP_MCH: "dashboard/getTopMerchants",

  //DDL
  DDL_GENERAL: "ddl/general",
  DDL_ROLECODE: "ddl/psrolpar",
  DDL_MCHUSER: "ddl/merchantUser",
  DDL_MCH: "ddl/psmrcpar",
  DDL_AVLUSER: "ddl/availableUser",
  DDL_TABLE_KEYS: "ddl/fieldNames",
  DDL_USER: "ddl/psusrprf",
  DDL_ACTION: "ddl/action",

  //ANNOUNCEMENT
  ANNOUNCEMENT_LIST: "pssysann/list",
  ANNOUNCEMENT_LIST2: "pssysann/list2",
  ANNOUNCEMENT_DETAIL: "pssysann/detail",
  ANNOUNCEMENT_CREATE: "pssysann/create",
  ANNOUNCEMENT_UPDATE: "pssysann/update",
  ANNOUNCEMENT_DELETE: "pssysann/delete",

  // STAFF
  STAFF_LIST: "psstfpar/list",
  STAFF_DETAIL: "psstfpar/detail",
  STAFF_CREATE: "psstfpar/create",
  STAFF_UPDATE: "psstfpar/update",
  STAFF_DELETE: "psstfpar/delete",

  // MERCHANT
  MCH_LIST: "psmrcpar/list",
  MCH_DETAIL: "psmrcpar/detail",
  MCH_CREATE: "psmrcpar/create",
  MCH_UPDATE: "psmrcpar/update",
  MCH_DELETE: "psmrcpar/delete",

  // REWARD
  RWD_LIST: "psrwdpar/list",
  RWD_DETAIL: "psrwdpar/detail",
  RWD_CREATE: "psrwdpar/create",
  RWD_UPDATE: "psrwdpar/update",
  RWD_DELETE: "psrwdpar/delete",
  RWD_LISTRDMP: "psrwdpar/listRdmp",

  // PRODUCT
  PROD_LIST: "psprdpar/list",
  PROD_DETAIL: "psprdpar/detail",
  PROD_CREATE: "psprdpar/create",
  PROD_UPDATE: "psprdpar/update",
  PROD_DELETE: "psprdpar/delete",

  // INVENTORY
  INV_LIST: "psprdinv/list",
  INV_DETAIL: "psprdinv/detail",
  INV_CREATE: "psprdinv/create",
  INV_UPDATE: "psprdinv/update",
  INV_DELETE: "psprdinv/delete",


  // MAINTENANCE LOG
  MAINT_LOG: "mntlog/list",

  // USER 
  USER_LOGIN: "psusrprf/login",
  USER_PROFILE: "psusrprf/profile",
  USER_PROFILE_UPDATE: "psusrprf/update_profile",
  USER_PROFILE_CHANGEPASSWORD: "psusrprf/change_password",
  HOME: "psusrprf/home",
  ADMIN_LIST: "psusrprf/list",
  ADMIN_DETAIL: "psusrprf/detail",
  ADMIN_CREATE: "psusrprf/create",
  ADMIN_UPDATE: "psusrprf/update",
  ADMIN_DELETE: "psusrprf/delete",
  ADMIN_PW_RESET: "psusrprf/change_admin_pwd",
  FORGOT_PASSWORD: "psusrprf/reset",

  // DOCUMENT
  DOCUMENT_UPLOAD: "document/upload",
  DOCUMENT_BULK_UPLOAD: "document/bulk_upload",
  DOC_DOWNLOAD: "document/download",

  // FUNCTION
  FUNCTIONS_LIST: "prfuncde/list",
  FUNCTIONS_DETAIL: "prfuncde/detail",
  FUNCTIONS_CREATE: "prfuncde/create",
  FUNCTIONS_UPDATE: "prfuncde/update",
  FUNCTIONS_DELETE: "prfuncde/delete",

  // ACCESSIBILITY
  ACCESSIBILITY_LIST: "prfunacs/list_role",
  ACCESSIBILITY_UPDATE: "prfunacs/action",

  // GENERAL TYPE
  GENTYP_LIST: "prgentyp/list",
  GENTYP_DETAIL: "prgentyp/detail",
  GENTYP_CREATE: "prgentyp/create",
  GENTYP_UPDATE: "prgentyp/update",
  GENTYP_DELETE: "prgentyp/delete",

  // GENERAL CODE
  GENCDE_LIST: "prgencde/list",
  GENCDE_DETAIL: "prgencde/detail",
  GENCDE_CREATE: "prgencde/create",
  GENCDE_UPDATE: "prgencde/update",
  GENCDE_DELETE: "prgencde/delete",

  //ROLE PARAMETER
  ROLE_LIST: "psrolpar/list",
  ROLE_DETAIL: "psrolpar/detail",
  ROLE_CREATE: "psrolpar/create",
  ROLE_UPDATE: "psrolpar/update",
  ROLE_DELETE: "psrolpar/delete",

  //REPORT
  REPORT_HISTORY: "report/list",
  REPORT_GENERATE: "report/generate",
  REPORT_DOWNLOAD: "report/download",
  REPORT_FORECAST: "report/forecast",
  REPORT_DETAILFORECAST: "report/findForecast",

  // HOLIDAY
  HOLIDAY_LIST: "psholpar/list",
  HOLIDAY_DETAIL: "psholpar/detail",
  HOLIDAY_CREATE: "psholpar/create",
  HOLIDAY_UPDATE: "psholpar/update",
  HOLIDAY_DELETE: "psholpar/delete",

  // WORK DAY
  WORKDAY_LIST: "pswdypar/list",
  WORKDAY_DETAIL: "pswdypar/detail",
  WORKDAY_CREATE: "pswdypar/create",
  WORKDAY_UPDATE: "pswdypar/update",
  WORKDAY_DELETE: "pswdypar/delete",

  // TABLE MANAGEMENT
  TABLE_KEY_LIST: "pstblmas/key_list",
  TABLE_KEY_DETAIL: "pstblmas/key_detail",
  CREATE_TABLE_KEY: "pstblmas/key_create",
  UPDATE_TABLE_KEY: "pstblmas/key_update",
  DELETE_TABLE_KEY: "pstblmas/key_delete",

  // TABLE MASTER
  FILE_MANAGE_LIST: "pstblmas/list",
  CREATE_FILE_MANAGE: "pstblmas/create",
  UPDATE_FILE_MANAGE: "pstblmas/update",
  FILE_MANAGE_DETAIL: "pstblmas/detail",
  DELETE_FILE_MANAGE: "pstblmas/delete",

  //MEMBER LIST
  MBR_LIST: "psmbrprf/list",
  MBR_DETAIL: "psmbrprf/detail",
  MBR_CREATE: "psmbrprf/create",
  MBR_UPDATE: "psmbrprf/update",
  MBR_DELETE: "psmbrprf/delete",

  //BACKUP
  LIST_BACKUP: "backup/list",
  BACKUP_GENBACKUP: "backup/backup",
  DOWNLOAD_BACKUP: "backup/download",

  //PASSWORD POLICY
  PASSWORD_POLICY_DETAIL: "prpwdpol/detail",
  PASSWORD_POLICY_UPDATE: "prpwdpol/update",

  //MAINTENANCE LOG
  MAINT_SUBFILE_LOG: "mntlog/sub_list",


  DASHBOARD_SALES: "dashboard/getMonthlySalesForPast12MonthsWithDescription",
  DASHBOARD_COMMISSION: "dashboard/getTotalCommissionPaidByMonthInPast12Months",

  ANNOUNCEMENT_ANNOUNCEMENT: "pssysann/announcement",

  // TRANSACTION CODE
  TRAN_CODE_LIST: "pstrnscd/list",
  TRAN_CODE_DETAIL: "pstrnscd/detail",
  TRAN_CODE_CREATE: "pstrnscd/create",
  TRAN_CODE_UPDATE: "pstrnscd/update",
  TRAN_CODE_DELETE: "pstrnscd/delete",


  //ORDER
  ORDER_LIST: "psordpar/list",
  ORDER_DETAIL: "psordpar/detail",
  ORDER_CANCEL: "psordpar/update_cancelled",
  ORDER_PAID: "psordpar/update_paid",
  ORDER_DONE: "psordpar/update_completed",
  ORDER_READY: "psordpar/update_preparing",

  //TRANSACTION
  TRAN_LIST: 'pstrxpar/list',
  TRAN_DETAIL: 'pstrxpar/detail',

  //REVIEW
  RVW_LISTM: "psordrvw/list_m",
};
