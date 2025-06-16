import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listAccessibility(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCESSIBILITY_LIST, "GET", data);
  return result;
}

export async function addUpdateAccessibility(data: any = {}): Promise<any> {
  const result = await api(
    API_ROUTES.ACCESSIBILITY_UPDATE,
    "POST",
    data
  );
  return result;
}