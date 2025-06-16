import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function user(): Promise<any> {
  const result = await api(API_ROUTES.USER_PROFILE, "GET");
  return result;
}
export async function userUpdate(data: any): Promise<any> {
  const result = await api(
    API_ROUTES.USER_PROFILE_UPDATE,
    "POST",
    data
  );
  return result;
}

export async function changePassword(data: any): Promise<any> {
  const result = await api(
    API_ROUTES.USER_PROFILE_CHANGEPASSWORD,
    "POST",
    data
  );
  return result;
}