import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listAdmin(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ADMIN_LIST, "GET", data);
  return result;
}

export async function detailAdmin(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ADMIN_DETAIL, "GET", data);
  return result;
}

export async function addUpdateAdmin(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.ADMIN_UPDATE : API_ROUTES.ADMIN_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeAdmin(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ADMIN_DELETE, "POST", data);
  return result;
}

export async function resetAdminPassword(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ADMIN_PW_RESET, "POST", data);
  return result;
}
