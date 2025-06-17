import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listMechants(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MCH_LIST, "GET", data);
  return result;
}

export async function merchantDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MCH_DETAIL, 'GET', data);
  return result;
}

export async function manageMerchant(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.MCH_UPDATE : API_ROUTES.MCH_CREATE,
    'POST', data);
  return result;
}

export async function removeMerchant(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MCH_DELETE, 'POST', data);
  return result;
}

