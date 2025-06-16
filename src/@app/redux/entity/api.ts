import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function list(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ENTITY_LIST, 'GET', data);
  return result;
}

export async function detail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ENTITY_DETAIL, 'GET', data);
  return result;
}
export async function treeList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ENTITY_TREE_LIST, 'GET', data);
  return result;
}

export async function addUpdate(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.UPDATE_ENTITY : API_ROUTES.CREATE_ENTITY, 
  'POST', data);
  return result;
}

export async function remove(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.DELETE_ENTITY, 'POST', data);
  return result;
}
