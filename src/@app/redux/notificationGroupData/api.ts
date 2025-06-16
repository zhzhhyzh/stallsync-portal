import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function notificationGroupDataList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTICATION_GROUP_DATA_LIST, "GET", data);
  return result;
}

export async function notificationGroupDataDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTICATION_GROUP_DATA_DETAIL, "GET", data);
  return result;
}

export async function manageNotificationGroupData(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.NOTICATION_GROUP_DATA_UPDATE : API_ROUTES.NOTICATION_GROUP_DATA_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeNotificationGroupData(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTICATION_GROUP_DATA_DELETE, "POST", data);
  return result;
}
