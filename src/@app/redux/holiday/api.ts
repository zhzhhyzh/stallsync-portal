import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listHoliday(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.HOLIDAY_LIST, "GET", data);
  return result;
}

export async function holidayDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.HOLIDAY_DETAIL, 'GET', data);
  return result;
}

export async function manageHoliday(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.HOLIDAY_UPDATE : API_ROUTES.HOLIDAY_CREATE, 
  'POST', data);
  return result;
}

export async function removeHoliday(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.HOLIDAY_DELETE, 'POST', data);
  return result;
}

