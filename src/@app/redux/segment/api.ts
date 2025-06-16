import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listSegment(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SEGMENT_LIST, "GET", data);
  return result;
}

export async function detailSegment(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SEGMENT_DETAIL, "GET", data);
  return result;
}

export async function addUpdateSegment(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.NOT_SEGMENT_UPDATE : API_ROUTES.NOT_SEGMENT_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeSegment(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SEGMENT_DELETE, "POST", data);
  return result;
}

export async function listSegmentPreview(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.NOT_SEGMENT_PREVIEW_LIST, "GET", data);
  return result;
}