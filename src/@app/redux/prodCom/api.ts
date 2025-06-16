import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listProdCom(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PRODCOM_LIST, "GET", data);
  return result;
}

export async function prodComDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PRODCOM_DETAIL, 'GET', data);
  return result;
}

export async function manageProdCom(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.PRODCOM_UPDATE : API_ROUTES.PRODCOM_CREATE, 
  'POST', data);
  return result;
}

export async function removeProdCom(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PRODCOM_DELETE, 'POST', data);
  return result;
}

