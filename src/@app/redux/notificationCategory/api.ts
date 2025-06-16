import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";


export async function notificationCategoryList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_CATEGORY_LIST, "GET", data);
  return result;
}

export async function notificationCategoryDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_CATEGORY_DETAIL, "GET", data);
  return result;
}

export async function manageNotificationCategory(data: any = {}): Promise<any> {
  const result = await api(
    API_ROUTES.NOTIFICATION_CATEGORY_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeNotificationCategory(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_CATEGORY_DELETE, "POST", data);
  return result;
}
