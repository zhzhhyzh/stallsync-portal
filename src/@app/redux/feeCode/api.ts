import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listFeeCodes(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FEE_CODE_LIST, "GET", data);
  return result;
}

export async function feeCodeDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FEE_CODE_DETAIL, 'GET', data);
  return result;
}

export async function manageFeeCode(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.FEE_CODE_UPDATE : API_ROUTES.FEE_CODE_CREATE, 
  'POST', data);
  return result;
}

export async function removeFeeCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FEE_CODE_DELETE, 'POST', data);
  return result;
}

