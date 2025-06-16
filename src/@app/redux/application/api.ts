import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function applicationList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.APPLICATION_LIST, "GET", data);
  return result;

}

export async function applicationDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.APPLICATION_DETAIL, "GET", data);
  return result;
}

export async function manageApplication(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.APPLICATION_UPDATE : API_ROUTES.APPLICATION_CREATE,
    "POST",
    data
  );
  return result;
} 
export async function approveApplication(data: any = {}): Promise<any> {
  const result = await api(
 API_ROUTES.APPLICATION_APPROVAL ,
    "POST",
    data
  );
  return result;
} 

export async function removeApplication(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.APPLICATION_DELETE, "POST", data);
  return result;
}
export async function applicationDocList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.APPLICATION_DOC_LIST, "GET", data);
  return result;

}

export async function applicationDocDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.APPLICATION_DOC_DETAIL, "GET", data);
  return result;
}

export async function manageApplicationDoc(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.APPLICATION_DOC_UPDATE : API_ROUTES.APPLICATION_DOC_UPLOAD,
    "POST",
    data
  );
  return result;
} 

export async function removeApplicationDoc(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.APPLICATION_DOC_DELETE, "POST", data);
  return result;
}
