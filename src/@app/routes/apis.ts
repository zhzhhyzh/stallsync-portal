export const API_ROUTES = {
  //-----::;

  //DASHBOARD
  DASHBOARD_MAIN: "dashboard/main",
  DASHBOARD_TOP_10: "dashboard/getTopMerchants",

  //DDL
  DDL_GENERAL: "ddl/general",
  DDL_ROLECODE: "ddl/psrolpar",
  DDL_MCHUSER: "ddl/merchantUser",


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
  CHECKER_MAKER_LIST: "pscmkpar/list",
  CHECKER_MAKER_DETAIL: "pscmkpar/detail",
  CHECKER_MAKER_CREATE: "pscmkpar/create",
  CHECKER_MAKER_UPDATE: "pscmkpar/update",
  CHECKER_MAKER_DELETE: "pscmkpar/delete",
  REQUEST_LIST: "pscmkrqt/list",
  REQUEST_DETAIL: "pscmkrqt/detail",
  REQUEST_CREATE: "pscmkrqt/create",
  REQUEST_APPROVE: "pscmkrqt/approve",
  DDL_CHK_MKR: "ddl/pscmkpar",
  DDL_USER: "ddl/psusrprf",
  DDL_WORKGROUPS: "ddl/workgroup",

  DDL_TABLE_KEYS: "ddl/fieldNames", //latest
  MAINT_SUBFILE_LOG: "mntlog/sub_list",

  DDL_CURRENCY: "ddl/pscurrat",
  DOC_DOWNLOAD: "document/download",
  DDL_ENTITY: "ddl/psentmas",
  DDL_FEECODE: "ddl/psfeecde",
  DDL_GLACPF: "ddl/psglacpf",
  DDL_TAXPAR: "ddl/pstaxpar",
  DDL_DSAGENT: "ddl/psdsgpar",
  DDL_ACTWRKGRP: "ddl/workgroup",
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


  //QUEUE
  QUEUE_DETAIL: "prquecde/detail",
  // QUEUE_FINDONE: "prquecde/find-one-code",
  QUEUE_LIST: "prquecde/list",
  QUEUE_CREATE: "prquecde/create",
  QUEUE_EDIT: "prquecde/edit",
  QUEUE_DELETE: "prquecde/delete",

  //ACTIVITY
  QUEUE_ACTLIST: "prquecde/actList",
  QUEUE_ACTDETAIL: "prquecde/actDetail",
  QUEUE_CREATEACT: "prquecde/createAct",
  QUEUE_EDITACT: "prquecde/editAct",
  QUEUE_DELETEACT: "prquecde/deleteAct",

  //ACTIVITY CHKLIST
  QUEUE_ACTCHKLIST: "prquecde/actChkList",
  QUEUE_ACTCHKDETAIL: "prquecde/actChkDetail",
  QUEUE_CREATEACTCHK: "prquecde/createActChk",
  QUEUE_EDITACTCHK: "prquecde/editActChk",
  QUEUE_DELETEACTCHK: "prquecde/deleteActChk",

  //ACTIVITY ACTIONS
  QUEUE_ACTACTLIST: "prquecde/actActList",
  QUEUE_ACTACTDETAIL: "prquecde/actActDetail",
  QUEUE_CREATEACTACT: "prquecde/createActAct",
  QUEUE_EDITACTACT: "prquecde/editActAct",
  QUEUE_DELETEACTACT: "prquecde/deleteActAct",
  QUEUE_CHKFIND: "prquecde/chkFind",

  //WORKGROUP
  WORKGROUP_DETAIL: "prawrkgrp/detail",
  WORKGROUP_LIST: "prawrkgrp/list",
  WORKGROUP_CREATE: "prawrkgrp/create",
  WORKGROUP_UPDATE: "prawrkgrp/update",
  WORKGROUP_DELETE: "prawrkgrp/delete",

  WORKGROUP_USER_LIST: "prawrkgrp/listUser",
  WORKGROUP_USER_LINK: "prawrkgrp/linkUser",
  WORKGROUP_USER_UNLINK: "prawrkgrp/unLinkUser",

  PROD_CODE_LIST: "psprdcod/list",
  PROD_CODE_DETAIL: "psprdcod/detail",
  PROD_CODE_CREATE: "psprdcod/create",
  PROD_CODE_UPDATE: "psprdcod/update",
  PROD_CODE_DELETE: "psprdcod/delete",

  PROD_LIST: "psprdpar/list",
  PROD_DETAIL: "psprdpar/detail",
  PROD_CREATE: "psprdpar/create",
  PROD_UPDATE: "psprdpar/update",
  PROD_DELETE: "psprdpar/delete",

  PRODCOM_LIST: "psprdcom/list",
  PRODCOM_DETAIL: "psprdcom/detail",
  PRODCOM_CREATE: "psprdcom/create",
  PRODCOM_UPDATE: "psprdcom/update",
  PRODCOM_DELETE: "psprdcom/delete",

  DSAGENT_LIST: "psdsgpar/list",
  DSAGENT_DETAIL: "psdsgpar/detail",
  DSAGENT_CREATE: "psdsgpar/create",
  DSAGENT_UPDATE: "psdsgpar/update",
  DSAGENT_DELETE: "psdsgpar/delete",

  CURRAT_LIST: "pscurrat/list",
  CURRAT_DETAIL: "pscurrat/detail",
  CURRAT_CREATE: "pscurrat/create",
  CURRAT_UPDATE: "pscurrat/update",
  CURRAT_DELETE: "pscurrat/delete",

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

  PRODUCT_LIST: "prquecde/prodList", //PRODUCT_QUEUE_LIST
  PRODUCT_QUEUE_LINK: "prquecde/prodLink",
  PRODUCT_QUEUE_UNLINK: "prquecde/prodUnLink",

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

  // PRODUCT FEE
  PROD_FEE_LIST: "psprdfee/list",
  PROD_FEE_DETAIL: "psprdfee/detail",
  PROD_FEE_CREATE: "psprdfee/create",
  PROD_FEE_UPDATE: "psprdfee/update",
  PROD_FEE_DELETE: "psprdfee/delete",
  // FEE CODE
  FEE_CODE_LIST: "psfeecde/list",
  FEE_CODE_DETAIL: "psfeecde/detail",
  FEE_CODE_CREATE: "psfeecde/create",
  FEE_CODE_UPDATE: "psfeecde/update",
  FEE_CODE_DELETE: "psfeecde/delete",

  // GL ACCOUNT
  GLA_LIST: "psglacpf/list",
  GLA_DETAIL: "psglacpf/detail",
  GLA_CREATE: "psglacpf/create",
  GLA_UPDATE: "psglacpf/update",
  GLA_DELETE: "psglacpf/delete",

  // TAX PARAMETER
  TAXPARAM_LIST: "pstaxpar/list",
  TAXPARAM_DETAIL: "pstaxpar/detail",
  TAXPARAM_CREATE: "pstaxpar/create",
  TAXPARAM_UPDATE: "pstaxpar/update",
  TAXPARAM_DELETE: "pstaxpar/delete",

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

  //PAYMENT ALLOCATION PRIORITY PARAMETER
  PAPPAR_LIST: "pspappar/list",
  PAPPAR_DETAIL: "pspappar/detail",
  PAPPAR_CREATE: "pspappar/create",
  PAPPAR_UPDATE: "pspappar/update",
  PAPPAR_DELETE: "pspappar/delete",

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

  //ROLE PARAMETER
  ROLE_LIST: "psrolpar/list",
  ROLE_DETAIL: "psrolpar/detail",
  ROLE_CREATE: "psrolpar/create",
  ROLE_UPDATE: "psrolpar/update",
  ROLE_DELETE: "psrolpar/delete",

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
  DDL_NOTIFICATION_GROUP: "ddl/psnotgrp",
  DDL_CHANNEL_SENDER: "ddl/channelSender",
  DDL_SEGMENT: "ddl/segment",
  DDL_CUSTOMER: "ddl/pscifmas",

  MANUAL_TRANS_RAISE_REQ: "psacctrx/raise_request",

  NOT_TEMPLATE_LIST: "psnotipf/list",
  NOT_TEMPLATE_DETAIL: "psnotipf/detail",
  NOT_TEMPLATE_MAINTAIN: "psnotipf/maintain",
  NOT_TEMPLATE_DELETE: "psnotipf/delete",
  NOT_VALIDATE_TEMPLATE: "psnotipf/validateTemplate",
  NOT_METADATA: "ddl/metadata",
  NOT_TEST_SEND: "psnotipf/send",
  NOT_NEWMESSAGE_SEND: "psnotipf/new_message",

  NOTIFICATION_GROUP_LIST: "psnotgrp/list",
  NOTIFICATION_GROUP_DETAIL: "psnotgrp/detail",
  NOTIFICATION_GROUP_CREATE: "psnotgrp/create",
  NOTIFICATION_GROUP_UPDATE: "psnotgrp/update",
  NOTIFICATION_GROUP_DELETE: "psnotgrp/delete",

  NOTICATION_GROUP_DATA_LIST: "psnotgrd/list",
  NOTICATION_GROUP_DATA_DETAIL: "psnotgrd/detail",
  NOTICATION_GROUP_DATA_CREATE: "psnotgrd/create",
  NOTICATION_GROUP_DATA_UPDATE: "psnotgrd/update",
  NOTICATION_GROUP_DATA_DELETE: "psnotgrd/delete",

  NOTIFICATION_SUBSCRIPTION_LIST: "psntspar/list",
  NOTIFICATION_SUBSCRIPTION_DETAIL: "psntspar/detail",
  NOTIFICATION_SUBSCRIPTION_CREATE: "psntspar/create",
  NOTIFICATION_SUBSCRIPTION_UPDATE: "psntspar/update",
  NOTIFICATION_SUBSCRIPTION_DELETE: "psntspar/delete",

  CHANNEL_CODE_LIST: "pschnpar/list",
  CHANNEL_CODE_DETAIL: "pschnpar/detail",
  CHANNEL_CODE_CREATE: "pschnpar/create",
  CHANNEL_CODE_UPDATE: "pschnpar/update",
  CHANNEL_CODE_DELETE: "pschnpar/delete",

  NOTIFICATION_CATEGORY_LIST: "pschnncp/list",
  NOTIFICATION_CATEGORY_DETAIL: "pschnncp/detail",
  NOTIFICATION_CATEGORY_CREATE: "pschnncp/create",
  NOTIFICATION_CATEGORY_DELETE: "pschnncp/delete",

  TEST_RECEIVER_ADD: "prnottrc/create",
  TEST_RECEIVER_UPDATE: "prnottrc/update",
  TEST_RECEIVER_LIST: "prnottrc/list",
  TEST_RECEIVER_DETAIL: "prnottrc/detail",
  TEST_RECEIVER_DELETE: "prnottrc/delete",
  TEST_RECEIVER_TEST: "prnottrc/test",

  PSHPAR_DETAIL: "pspshpar/detail",
  PSHPAR_MAINTAIN: "pspshpar/maintain",

  METADATA_LIST: "psnotmda/list",
  METADATA_DETAIL: "psnotmda/detail",
  METADATA_CREATE: "psnotmda/create",
  METADATA_UPDATE: "psnotmda/update",
  METADATA_DELETE: "psnotmda/delete",
  METADATA_UPLOAD: "psnotmda/upload",
  METADATA_UPLOAD_JSON: "psnotmda/uploadJson",

  NOT_SEGMENT_LIST: "psnotsgp/list",
  NOT_SEGMENT_DETAIL: "psnotsgp/detail",
  NOT_SEGMENT_CREATE: "psnotsgp/create",
  NOT_SEGMENT_UPDATE: "psnotsgp/update",
  NOT_SEGMENT_DELETE: "psnotsgp/delete",
  NOT_SEGMENT_PREVIEW_LIST: "psnotsgp/preview",

  DEAL_DATE_LIST: "psddtpar/list",
  DEAL_DATE_DETAIL: "psddtpar/detail",
  DEAL_DATE_CREATE: "psddtpar/create",
  DEAL_DATE_UPDATE: "psddtpar/update",
  DEAL_DATE_DELETE: "psddtpar/delete",

  OMNI_REPORT_HISTORY: "omnisendReport/list",
  OMNI_REPORT_GENERATE: "omnisendReport/generate",
  OMNI_REPORT_DOWNLOAD: "omnisendReport/download",

  REPORT_HISTORY: "report/list",
  REPORT_GENERATE: "report/generate",
  REPORT_GENERATEREWARD: "report/generateRewardReport",
  REPORT_LISTREWARD: "report/listReward",
  REPORT_DOWNLOAD: "report/download",

  NOT_SCHEDULE_DETAIL: "psnotipf/schedule",
  NOT_SCHEDULE_CREATE: "psnotipf/create_schedule",
  NOT_SCHEDULE_UPDATE: "psnotipf/update_schedule",
  NOT_SCHEDULE_LIST: "psnotipf/upcoming_schedule",
  NOT_SCHEDULE_LIST_DETAIL: "psnotipf/upcoming_schedule_detail",
  NOT_SCHEDULE_DELETE: "psnotipf/delete_schedule",
  NOT_SCHEDULE_RECIPIENTS: "psnotipf/list_scheduled_recipients",

  NOT_HISTORY_CUSTOMER_LIST: "psnotipf/list_history",
  NOT_HISTORY_TEMPLATE_LIST: "psnotipf/list_history_template",
  NOT_HISTORY_TEMPLATE_LIST_DETAIL: "psnotipf/list_history_template_detail",
  NOT_HISTORY_RECIPIENTS: "psnotipf/list_history_recipients",

  NOT_HISTORY_ACCOUNT_LIST: "psnotipf/list_history_account",
  //NOT_HISTORY_ACCOUNT_LIST_DETAIL: "psnotipf/list_history_account_detail",


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
