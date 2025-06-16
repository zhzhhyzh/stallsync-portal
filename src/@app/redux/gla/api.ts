import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listGlas(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GLA_LIST, "GET", data);
  return result;
}

export async function glaDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GLA_DETAIL, 'GET', data);
  return result;
}

export async function manageGla(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.GLA_UPDATE : API_ROUTES.GLA_CREATE, 
  'POST', data);
  return result;
}

export async function removeGla(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GLA_DELETE, 'POST', data);
  return result;
}

