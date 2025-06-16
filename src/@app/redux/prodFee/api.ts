import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listProdFees(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_FEE_LIST, "GET", data);
  return result;
}

export async function prodFeeDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_FEE_DETAIL, 'GET', data);
  return result;
}

export async function manageProdFee(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.PROD_FEE_UPDATE : API_ROUTES.PROD_FEE_CREATE, 
  'POST', data);
  return result;
}

export async function removeProdFee(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_FEE_DELETE, 'POST', data);
  return result;
}

