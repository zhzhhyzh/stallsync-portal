import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listAnnouncement(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ANNOUNCEMENT_LIST, "GET", data);
  return result;
}
export async function listAnnouncement2(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ANNOUNCEMENT_LIST2, "GET", data);
  return result;
}




export async function manageAnnouncement(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.ANNOUNCEMENT_UPDATE : API_ROUTES.ANNOUNCEMENT_CREATE, 
  'POST', data);
  return result;
}

export async function detailAnnouncement(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ANNOUNCEMENT_DETAIL, 'GET', data);
  return result;
}

  
export async function removeAnnouncement(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ANNOUNCEMENT_DELETE, 'POST', data);
  return result;
}

export async function announcement(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ANNOUNCEMENT_ANNOUNCEMENT, 'POST', data);
  return result;
}

  