import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function detailPushParam(): Promise<any> {
  const result = await api(API_ROUTES.PSHPAR_DETAIL, "GET");
  return result;
}

export async function maintainPushParam(data: any = {}): Promise<any> {
  const result = await api(
    API_ROUTES.PSHPAR_MAINTAIN,
    "POST",
    data
  );
  return result;
}
