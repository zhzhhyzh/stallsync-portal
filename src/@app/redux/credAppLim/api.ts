import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listCredAppLims(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CRED_APP_LIST, "GET", data);
  return result;
}

export async function credAppLimDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CRED_APP_DETAIL, 'GET', data);
  return result;
}

export async function manageCredAppLim(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.CRED_APP_UPDATE : API_ROUTES.CRED_APP_CREATE, 
  'POST', data);
  return result;
}

export async function removeCredAppLim(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CRED_APP_DELETE, 'POST', data);
  return result;
}

