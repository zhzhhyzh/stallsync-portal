import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function detailSchedule(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_DETAIL, "GET", data);
  return result;
}

export async function addSchedule(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_CREATE, "POST", data);
  return result;
}

export async function updateSchedule(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_UPDATE, "POST", data);
  return result;
}

export async function listSchedule(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_LIST, "GET", data);
  return result;
}

export async function listScheduleDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_LIST_DETAIL, "GET", data);
  return result;
}

export async function deleteSchedule(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_DELETE, "POST", data);
  return result;
}

export async function listScheduleRecipients(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SCHEDULE_RECIPIENTS, "GET", data);
  return result;
}