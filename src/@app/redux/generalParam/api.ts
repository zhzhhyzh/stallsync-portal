import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listType(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GENTYP_LIST, 'GET', data);
  return result;
}

export async function detailType(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GENTYP_DETAIL, 'GET', data);
  return result;
}

export async function addUpdateType(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.GENTYP_UPDATE : API_ROUTES.GENTYP_CREATE, 
  'POST', data);
  return result;
}

export async function removeType(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GENTYP_DELETE, 'POST', data);
  return result;
}

export async function listCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GENCDE_LIST, 'GET', data);
  return result;
}

export async function detailCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GENCDE_DETAIL, 'GET', data);
  return result;
}

export async function addUpdateCode(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.GENCDE_UPDATE : API_ROUTES.GENCDE_CREATE,
  'POST', data);
  return result;
}

export async function removeCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GENCDE_DELETE, 'POST', data);
  return result;
}