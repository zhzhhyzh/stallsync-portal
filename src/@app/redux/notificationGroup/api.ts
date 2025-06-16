import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function notificationGroupList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_GROUP_LIST, "GET", data);
  return result;
}

export async function notificationGroupDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_GROUP_DETAIL, "GET", data);
  return result;
}

export async function manageNotificationGroup(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.NOTIFICATION_GROUP_UPDATE : API_ROUTES.NOTIFICATION_GROUP_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeNotificationGroup(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_GROUP_DELETE, "POST", data);
  return result;
}
