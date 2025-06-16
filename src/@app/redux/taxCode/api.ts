import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listTaxCodes(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TAXPARAM_LIST, "GET", data);
  return result;
}

export async function taxCodeDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TAXPARAM_DETAIL, 'GET', data);
  return result;
}

export async function manageTaxCode(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.TAXPARAM_UPDATE : API_ROUTES.TAXPARAM_CREATE, 
  'POST', data);
  return result;
}

export async function removeTaxCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TAXPARAM_DELETE, 'POST', data);
  return result;
}

