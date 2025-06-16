import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function channelCodeList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CHANNEL_CODE_LIST, "GET", data);
  return result;
}

export async function channelCodeDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CHANNEL_CODE_DETAIL, "GET", data);
  return result;
}

export async function manageChannelCode(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.CHANNEL_CODE_UPDATE : API_ROUTES.CHANNEL_CODE_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeChannelCode(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CHANNEL_CODE_DELETE, "POST", data);
  return result;
}

export async function notificationCategoryList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_CATEGORY_LIST, "GET", data);
  return result;
}

export async function notificationCodeDetail(data: any = {}): Promise<any> {
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
