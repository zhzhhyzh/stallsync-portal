import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listPappar(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PAPPAR_LIST, "GET", data);
  return result;
}

export async function papparDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PAPPAR_DETAIL, 'GET', data);
  return result;
}

export async function managePappar(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.PAPPAR_UPDATE : API_ROUTES.PAPPAR_CREATE, 
  'POST', data);
  return result;
}

export async function removePappar(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PAPPAR_DELETE, 'POST', data);
  return result;
}

