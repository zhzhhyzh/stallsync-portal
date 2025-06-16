import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function workgroupList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKGROUP_LIST, "GET", data);
  return result;
}

export async function workgroupDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKGROUP_DETAIL, "GET", data);
  return result;
}

export async function manageWorkgroup(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.WORKGROUP_UPDATE : API_ROUTES.WORKGROUP_CREATE,
    "POST",
    data
  );
  return result;
}

export async function deleteWorkgroup(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKGROUP_DELETE, "POST", data);
  return result;
}
