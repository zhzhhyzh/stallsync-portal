import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listFunctions(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FUNCTIONS_LIST, "GET", data);
  return result;
}

export async function detailFunctions(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FUNCTIONS_DETAIL, "GET", data);
  return result;
}

export async function addUpdateFunctions(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.FUNCTIONS_UPDATE : API_ROUTES.FUNCTIONS_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeFunctions(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.FUNCTIONS_DELETE, "POST", data);
  return result;
}
