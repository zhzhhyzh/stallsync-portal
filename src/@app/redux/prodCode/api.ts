import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listProdCodes(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_CODE_LIST, "GET", data);
  return result;
}

export async function prodCodeDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_CODE_DETAIL, 'GET', data);
  return result;
}

export async function manageProdCode(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.PROD_CODE_UPDATE : API_ROUTES.PROD_CODE_CREATE, 
  'POST', data);
  return result;
}

export async function removeProdCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_CODE_DELETE, 'POST', data);
  return result;
}

