import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listHistoryByNotTemplate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_HISTORY_TEMPLATE_LIST, "GET", data);
  return result;
}

export async function historyByNotTemplateDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_HISTORY_TEMPLATE_LIST_DETAIL, "GET", data);
  return result;
}

// export async function detailHistoryByNotTemplate(data: any = {}): Promise<any> {
//   const result = await api(API_ROUTES.ADMIN_DETAIL, "GET", data);
//   return result;
// }

// export async function addUpdateHistoryByNotTemplate(data: any = {}): Promise<any> {
//   const result = await api(
//     data.id ? API_ROUTES.ADMIN_UPDATE : API_ROUTES.ADMIN_CREATE,
//     "POST",
//     data
//   );
//   return result;
// }

// export async function removeHistoryByNotTemplate(data: any = {}): Promise<any> {
//   const result = await api(API_ROUTES.ADMIN_DELETE, "POST", data);
//   return result;
// }

export async function listHistoryByCustomer(data: any = {}): Promise<any> {
  //API_ROUTES.NOT_HISTORY_CUSTOMER_LIST - New api, cannot use for now, temporary use NOTIFICATION_LIST
  const result = await api(API_ROUTES.NOT_HISTORY_CUSTOMER_LIST, "GET", data);
  return result;
}

export async function listRecipients(data: any = {}): Promise<any> {
  //API_ROUTES.NOT_HISTORY_CUSTOMER_LIST - New api, cannot use for now, temporary use NOTIFICATION_LIST
  const result = await api(API_ROUTES.NOT_HISTORY_RECIPIENTS, "GET", data);
  return result;
}

export async function listHistoryByAccount(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_HISTORY_ACCOUNT_LIST, "GET", data);
  return result;
}

// export async function historyByAccountDetail(data: any = {}): Promise<any> {
//   const result = await api(API_ROUTES.NOT_HISTORY_ACCOUNT_LIST_DETAIL, "GET", data);
//   return result;
// }