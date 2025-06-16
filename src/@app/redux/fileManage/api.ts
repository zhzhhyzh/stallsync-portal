import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function fileManagementList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FILE_MANAGE_LIST, "GET", data);
  return result;
}

export async function fileManagementDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FILE_MANAGE_DETAIL, 'GET', data);
  return result;
}

export async function manageFileManagement(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.UPDATE_FILE_MANAGE : API_ROUTES.CREATE_FILE_MANAGE, 
  'POST', data);
  return result;
}

export async function removeFileManagement(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.DELETE_FILE_MANAGE, 'POST', data);
  return result;
}
