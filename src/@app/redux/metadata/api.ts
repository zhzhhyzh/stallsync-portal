import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listMetadata(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.METADATA_LIST, "GET", data);
  return result;
}

export async function detailMetadata(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.METADATA_DETAIL, "GET", data);
  return result;
}

export async function addUpdateMetadata(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.METADATA_UPDATE : API_ROUTES.METADATA_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeMetadata(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.METADATA_DELETE, "POST", data);
  return result;
}

export async function uploadMetadata(data: any): Promise<any> {
  const result = await api(API_ROUTES.METADATA_UPLOAD, 'POST', data)
  return result
}
export async function uploadMetadataJSON(data: any): Promise<any> {
  const result = await api(API_ROUTES.METADATA_UPLOAD_JSON, 'POST', data)
  return result
}