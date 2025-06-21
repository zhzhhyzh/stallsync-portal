export const API_ROUTES = {
  //-----::;

  //DASHBOARD
  DASHBOARD_MAIN: "dashboard/main",
  DASHBOARD_TOP_10: "dashboard/getTopMerchants",

  //DDL
  DDL_GENERAL: "ddl/general",
  DDL_ROLECODE: "ddl/psrolpar",
  DDL_MCHUSER: "ddl/merchantUser",
  DDL_MCH: "ddl/psmrcpar",
  DDL_AVLUSER: "ddl/availableUser",
  DDL_TABLE_KEYS: "ddl/fieldNames",


  //ANNOUNCEMENT
  ANNOUNCEMENT_LIST: "pssysann/list",
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
  FORGOT_PASSWORD: "psusrprf/admin_reset",

  // DOCUMENT
  DOCUMENT_UPLOAD: "document/upload",
  DOCUMENT_BULK_UPLOAD: "document/bulk_upload",

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
  //-----::;
  DASHBOARD_SALES: "dashboard/getMonthlySalesForPast12MonthsWithDescription",
  DASHBOARD_COMMISSION: "dashboard/getTotalCommissionPaidByMonthInPast12Months",

  ANNOUNCEMENT_ANNOUNCEMENT: "pssysann/announcement",
  MEMBER_DETAIL: "psmbrprf/detail",
  MEMBER_LIST: "psmbrprf/list",
  MEMBER_CREATE: "psmbrprf/create",
  MEMBER_UPDATE_PROFILE: "psmbrprf/update_profile",
  MEMBER_PROFILE: "psmbrprf/profile",
  MEMBER_SALES: "psmbrprf/sales",
  AGENT_LIST: "psagtinc/list",
  AGENT_CREATE: "psagtinc/create",
  AGENT_DETAIL: "psagtinc/detail",
  AGENT_UPDATE: "psagtinc/update",
  AGENT_DELETE: "psagtinc/delete",
  APPLICATION_DETAIL: "application/detail",
  APPLICATION_LIST: "application/list",
  APPLICATION_CREATE: "application/create",
  APPLICATION_DELETE: "application/delete",
  APPLICATION_UPDATE: "application/update",
  APPLICATION_APPROVAL: "application/approval",
  APPLICATION_DOC_DETAIL: "application/document_detail",
  APPLICATION_DOC_LIST: "application/list_documents",
  APPLICATION_DOC_UPDATE: "application/update_document",
  APPLICATION_DOC_DELETE: "application/delete_document",
  APPLICATION_DOC_UPLOAD: "application/upload_document",
  CONTRACT_DOC_DETAIL: "psconmas/document_detail",
  CONTRACT_DOC_LIST: "psconmas/list_documents",
  CONTRACT_DOC_UPDATE: "psconmas/update_document",
  CONTRACT_DOC_DELETE: "psconmas/delete_document",
  CONTRACT_DOC_UPLOAD: "psconmas/upload_document",

  REQUEST_LIST: "pscmkrqt/list",
  REQUEST_DETAIL: "pscmkrqt/detail",
  REQUEST_CREATE: "pscmkrqt/create",
  REQUEST_APPROVE: "pscmkrqt/approve",
  DDL_USER: "ddl/psusrprf",
  DDL_WORKGROUPS: "ddl/workgroup",

  MAINT_SUBFILE_LOG: "mntlog/sub_list",

  DOC_DOWNLOAD: "document/download",
  DDL_ENTITY: "ddl/psentmas",
  DDL_DSAGENT: "ddl/psdsgpar",
  DDL_TRANSCODE: "ddl/transactioncode",
  DDL_PRICODE: "ddl/pricingplan",
  DDL_PROCODE: "ddl/products",
  DDL_ACTION: "ddl/action",
  DDL_PRODUCT: "ddl/psprdpar",
  DDL_AGENT: "ddl/psmbrprf",

  CONTRACT_LIST: "psconmas/list",
  CONTRACT_DETAIL: "psconmas/detail",
  CONTRACT_CREATE: "psconmas/create",
  CONTRACT_UPDATE: "psconmas/update",
  CONTRACT_DELETE: "psconmas/delete",





  //WORKGROUP
  WORKGROUP_DETAIL: "prawrkgrp/detail",
  WORKGROUP_LIST: "prawrkgrp/list",
  WORKGROUP_CREATE: "prawrkgrp/create",
  WORKGROUP_UPDATE: "prawrkgrp/update",
  WORKGROUP_DELETE: "prawrkgrp/delete",

  WORKGROUP_USER_LIST: "prawrkgrp/listUser",
  WORKGROUP_USER_LINK: "prawrkgrp/linkUser",
  WORKGROUP_USER_UNLINK: "prawrkgrp/unLinkUser",

  DSAGENT_LIST: "psdsgpar/list",
  DSAGENT_DETAIL: "psdsgpar/detail",
  DSAGENT_CREATE: "psdsgpar/create",
  DSAGENT_UPDATE: "psdsgpar/update",
  DSAGENT_DELETE: "psdsgpar/delete",

  HOLIDAY_LIST: "psholpar/list",
  HOLIDAY_DETAIL: "psholpar/detail",
  HOLIDAY_CREATE: "psholpar/create",
  HOLIDAY_UPDATE: "psholpar/update",
  HOLIDAY_DELETE: "psholpar/delete",

  WORKDAY_LIST: "pswdypar/list",
  WORKDAY_DETAIL: "pswdypar/detail",
  WORKDAY_CREATE: "pswdypar/create",
  WORKDAY_UPDATE: "pswdypar/update",
  WORKDAY_DELETE: "pswdypar/delete",


  // TRANSACTION CODE
  TRAN_CODE_LIST: "pstrnscd/list",
  TRAN_CODE_DETAIL: "pstrnscd/detail",
  TRAN_CODE_CREATE: "pstrnscd/create",
  TRAN_CODE_UPDATE: "pstrnscd/update",
  TRAN_CODE_DELETE: "pstrnscd/delete",

  // Company Parameter
  COMPAR_LIST: "pscompar/list",
  COMPAR_DETAIL: "pscompar/detail",
  COMPAR_CREATE: "pscompar/create",
  COMPAR_UPDATE: "pscompar/update",
  COMPAR_DELETE: "pscompar/delete",



  // CREDIT APPROVAL LIMIT
  CRED_APP_LIST: "pscraplm/list",
  CRED_APP_DETAIL: "pscraplm/detail",
  CRED_APP_CREATE: "pscraplm/create",
  CRED_APP_UPDATE: "pscraplm/update",
  CRED_APP_DELETE: "pscraplm/delete",

  LIST_BACKUP: "backup/list",
  BACKUP_GENBACKUP: "backup/backup",
  DOWNLOAD_BACKUP: "backup/download",

  PASSWORD_POLICY_DETAIL: "prpwdpol/detail",
  PASSWORD_POLICY_UPDATE: "prpwdpol/update",

  APPLICATION: "application/application",

  APPLICATION_UPLOAD_DOC: "application/upload_document",
  APPLICATION_UPDATE_DOC: "application/update_document",
  APPLICATION_LIST_DOCS: "application/list_documents",
  APPLICATION_DELETE_DOC: "application/delete_document",


  FILE_MANAGE_LIST: "pstblmas/list",
  CREATE_FILE_MANAGE: "pstblmas/create",
  UPDATE_FILE_MANAGE: "pstblmas/update",
  FILE_MANAGE_DETAIL: "pstblmas/detail",
  DELETE_FILE_MANAGE: "pstblmas/delete",

  TABLE_KEY_LIST: "pstblmas/key_list",
  TABLE_KEY_DETAIL: "pstblmas/key_detail",
  CREATE_TABLE_KEY: "pstblmas/key_create",
  UPDATE_TABLE_KEY: "pstblmas/key_update",
  DELETE_TABLE_KEY: "pstblmas/key_delete",
  ENTITY_LIST: "psentmas/list",
  ENTITY_TREE_LIST: "psentmas/tree_list",
  ENTITY_DETAIL: "psentmas/detail",
  CREATE_ENTITY: "psentmas/create",
  UPDATE_ENTITY: "psentmas/update",
  DELETE_ENTITY: "psentmas/delete",



  //LOAN
  CALCULATE_LOAN: "loancalr/calculate_loan",
  ACCOUNT_LIST: "psaccmas/list",
  ACCOUNT_DETAIL_LIST: "psaccmas/detail",
  ACCOUNT_DETAIL: "psaccmas/account_detail",
  ACCOUNT_DETAIL_UPDATE: "psaccmas/account_update",
  ACCOUNT_PRE_CALCULATE: "psaccmas/pre_calculate",
  ACCOUNT_BILLING_LIST: "psaccbil/list",
  ACCOUNT_TRANSACTION_LIST: "psacctrx/list",
  ACCOUNT_RELATIONSHIP_LIST: "psaccrls/list",
  ACCOUNT_CUSTOMER_RELATIONSHIP_LIST: "pscifspo/list",
  ACCOUNT_MESSAGE_LIST: "psaccmsg/list",

  DDL_ENTITY_BANK: "ddl/entitybank",
  DDL_CHANNEL_SENDER: "ddl/channelSender",
  DDL_CUSTOMER: "ddl/pscifmas",

  MANUAL_TRANS_RAISE_REQ: "psacctrx/raise_request",

  DEAL_DATE_LIST: "psddtpar/list",
  DEAL_DATE_DETAIL: "psddtpar/detail",
  DEAL_DATE_CREATE: "psddtpar/create",
  DEAL_DATE_UPDATE: "psddtpar/update",
  DEAL_DATE_DELETE: "psddtpar/delete",




  PROMOTION_LISTING: "psmbrprm/list",
  PROMOTION_SALES: "psmbrprm/list_sales",
  PROMOTION_DOWNLINE_PROMOTION: "psmbrprm/list_promotions",
  PROMOTION_RECRUITS_LISTING: "psmbrprm/list_recruits",
  PROMOTION_DETAIL: "psmbrprm/detail",
  PROMOTION_UPDATE: "psmbrprm/update",

  PERSONAL_COMMISSION_LISTING: "psconcom/list_personal_com",
  GROUP_COMMISSION_LISTING: "psconcom/list_group_com",
  COMMISSION_LISTING: "psconcom/list",
  COMPANY_DDL: "ddl/psmbrcom",

};
