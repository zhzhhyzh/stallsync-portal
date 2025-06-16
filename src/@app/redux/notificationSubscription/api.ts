import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function notificationSubscriptionList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_SUBSCRIPTION_LIST, "GET", data);
  return result;
}

export async function notificationSubscriptionDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_SUBSCRIPTION_DETAIL, "GET", data);
  return result;
}

export async function manageNotificationSubscription(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.NOTIFICATION_SUBSCRIPTION_UPDATE : API_ROUTES.NOTIFICATION_SUBSCRIPTION_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeNotificationSubscription(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOTIFICATION_SUBSCRIPTION_DELETE, "POST", data);
  return result;
}
