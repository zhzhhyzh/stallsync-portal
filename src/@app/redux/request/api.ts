import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listRequest(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REQUEST_LIST, 'GET', data);
  return result;
}

export async function detailRequest(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REQUEST_DETAIL, 'GET', data);
  return result;
}

export async function approveRequest(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REQUEST_APPROVE, 'POST', data);
  return result;
}
export async function createRequest(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REQUEST_CREATE, 'POST', data);
  return result;
}