import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listCompars(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.COMPAR_LIST, "GET", data);
  return result;
}

export async function comparDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.COMPAR_DETAIL, 'GET', data);
  return result;
}

export async function manageCompar(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.COMPAR_UPDATE : API_ROUTES.COMPAR_CREATE, 
  'POST', data);
  return result;
}

export async function removeCompar(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.COMPAR_DELETE, 'POST', data);
  return result;
}

