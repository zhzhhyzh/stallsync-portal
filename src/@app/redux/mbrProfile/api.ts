import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listMbrs(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MBR_LIST, "GET", data);
  return result;
}

export async function mbrDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MBR_DETAIL, 'GET', data);
  return result;
}

export async function manageMbr(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.MBR_UPDATE : API_ROUTES.MBR_CREATE,
    'POST', data);
  return result;
}

export async function removeMbr(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MBR_DELETE, 'POST', data);
  return result;
}

