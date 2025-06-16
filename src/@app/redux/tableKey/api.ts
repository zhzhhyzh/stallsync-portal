import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function tableKeyList(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.TABLE_KEY_LIST, "GET", data);
    return result;
  }
  
  export async function tableKeyDetail(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.TABLE_KEY_DETAIL, 'GET', data);
    return result;
  }
  
  export async function manageTableKey(data: any = {}): Promise<any> {
    const result = await api(data.id ? API_ROUTES.UPDATE_TABLE_KEY : API_ROUTES.CREATE_TABLE_KEY, 
    'POST', data);
    return result;
  }
  
  export async function removeTableKey(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.DELETE_TABLE_KEY, 'POST', data);
    return result;
  }