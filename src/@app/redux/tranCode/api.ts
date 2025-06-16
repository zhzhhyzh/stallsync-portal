import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listTranCodes(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TRAN_CODE_LIST, "GET", data);
  return result;
}

export async function tranCodeDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TRAN_CODE_DETAIL, 'GET', data);
  return result;
}

export async function manageTranCode(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.TRAN_CODE_UPDATE : API_ROUTES.TRAN_CODE_CREATE, 
  'POST', data);
  return result;
}

export async function removeTranCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TRAN_CODE_DELETE, 'POST', data);
  return result;
}

