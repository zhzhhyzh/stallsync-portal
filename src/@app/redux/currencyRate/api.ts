import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listCurrat(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CURRAT_LIST, "GET", data);
  return result;
}

export async function curratDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CURRAT_DETAIL, 'GET', data);
  return result;
}

export async function manageCurrat(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.CURRAT_UPDATE : API_ROUTES.CURRAT_CREATE, 
  'POST', data);
  return result;
}

export async function removeCurrat(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CURRAT_DELETE, 'POST', data);
  return result;
}

