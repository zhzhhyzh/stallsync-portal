import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listNotificationTemplate(data: {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_TEMPLATE_LIST, "GET", data);
  return result;
}

export async function detailNotificationTemplate(data: {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_TEMPLATE_DETAIL, "GET", data);
  return result;
}

export async function addUpdateNotificationTemplate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_TEMPLATE_MAINTAIN, "POST", data);
  return result;
}

export async function removeNotificationTemplate(data:{}): Promise<any> {
    const result = await api(API_ROUTES.NOT_TEMPLATE_DELETE, 'POST',data);
    return result;
}

export async function testSend(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_TEST_SEND, "POST", data);
  return result;
}

export async function ddlSegment(data: {}): Promise<any> {
  const result = await api(API_ROUTES.DDL_SEGMENT, "GET", data);
  return result;
}

export async function validateTemplate(data: {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_VALIDATE_TEMPLATE, "POST", data);
  return result;
}

export async function newMessageSend(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_NEWMESSAGE_SEND, "POST", data);
  return result;
}