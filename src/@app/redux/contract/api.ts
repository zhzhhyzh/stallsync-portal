import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function contractList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CONTRACT_LIST, "GET", data);
  return result;

}

export async function contractDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CONTRACT_DETAIL, "GET", data);
  return result;
}

export async function manageContract(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.CONTRACT_UPDATE : API_ROUTES.CONTRACT_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeContract(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CONTRACT_DELETE, "POST", data);
  return result;
}

export async function contractDocList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CONTRACT_DOC_LIST, "GET", data);
  return result;

}

export async function contractDocDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CONTRACT_DOC_DETAIL, "GET", data);
  return result;
}

export async function managecontractDoc(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.CONTRACT_DOC_UPDATE : API_ROUTES.CONTRACT_DOC_UPLOAD,
    "POST",
    data
  );
  return result;
} 

export async function removecontractDoc(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CONTRACT_DOC_DELETE, "POST", data);
  return result;
}

