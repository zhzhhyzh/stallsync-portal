import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function testReceiverList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TEST_RECEIVER_LIST, "GET", data);
  return result;
}

export async function testReceiverDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TEST_RECEIVER_DETAIL, "GET", data);
  return result;
}

export async function testReceiverAdd(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TEST_RECEIVER_ADD, "POST", data);
  return result;
}

export async function testReceiverUpdate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TEST_RECEIVER_UPDATE, "POST", data);
  return result;
}

export async function testReceiverDelete(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TEST_RECEIVER_DELETE, "POST", data);
  return result;
}
  

export async function testReceiverTest(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TEST_RECEIVER_TEST, "POST", data);
  return result;
}
