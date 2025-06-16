import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function workgroupUserList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKGROUP_USER_LIST, "GET", data);
  return result;
}

export async function workgroupUserLink(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKGROUP_USER_LINK, "POST", data);
  return result;
}

// export async function manageWorkgroup(data: any = {}): Promise<any> {
//   const result = await api(
//     data.id ? API_ROUTES.WORKGROUP_UPDATE : API_ROUTES.WORKGROUP_CREATE,
//     "POST",
//     data
//   );
//   return result;
// }

export async function workgroupUserUnlink(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.WORKGROUP_USER_UNLINK, "POST", data);
  return result;
}
