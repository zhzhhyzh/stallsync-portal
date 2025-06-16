import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listWorkDay(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKDAY_LIST, "GET", data);
  return result;
}

export async function workDayDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKDAY_DETAIL, 'GET', data);
  return result;
}

export async function manageWorkDay(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKDAY_UPDATE, 
  'POST', data);
  return result;
}

export async function removeWorkDay(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKDAY_DELETE, 'POST', data);
  return result;
}

