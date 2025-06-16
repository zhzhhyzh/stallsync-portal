import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listDealDate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.DEAL_DATE_LIST, "GET", data);
  return result;
}

export async function dealDateDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.DEAL_DATE_DETAIL, 'GET', data);
  return result;
}

export async function manageDealDate(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.DEAL_DATE_UPDATE : API_ROUTES.DEAL_DATE_CREATE, 
  'POST', data);
  return result;
}

export async function removeDealDate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.DEAL_DATE_DELETE, 'POST', data);
  return result;
}

