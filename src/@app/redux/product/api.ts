import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function productList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PRODUCT_LIST, "GET", data);
  return result;
}

export async function productQueueLink(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PRODUCT_QUEUE_LINK, "POST", data);
  return result;
}

export async function productQueueUnlink(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PRODUCT_QUEUE_UNLINK, "POST", data);
  return result;
}