import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function detailPasswordPolicy(): Promise<any> {
  const result = await api(API_ROUTES.PASSWORD_POLICY_DETAIL, "GET");
  return result;
}

export async function updatePasswordPolicy(data: any = {}): Promise<any> {
  const result = await api(
    API_ROUTES.PASSWORD_POLICY_UPDATE,
    "POST",
    data
  );
  return result;
}
