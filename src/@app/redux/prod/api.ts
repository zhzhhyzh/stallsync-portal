import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listProd(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_LIST, "GET", data);
  return result;
}

export async function prodDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_DETAIL, 'GET', data);
  return result;
}

export async function manageProd(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.PROD_UPDATE : API_ROUTES.PROD_CREATE, 
  'POST', data);
  return result;
}

export async function removeProd(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_DELETE, 'POST', data);
  return result;
}

