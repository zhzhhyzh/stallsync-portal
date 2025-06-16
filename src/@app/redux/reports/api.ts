import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listReport(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REPORT_HISTORY, "GET", data);
  return result;
}

export async function downloadReport(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REPORT_DOWNLOAD, "GET", data,{},false,{
    downloadFlag: true,
  });
  return result;
}

export async function listReward(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REPORT_LISTREWARD, "GET", data);
  return result;
}

export async function generateReport(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REPORT_GENERATE, "POST", data);
  return result;
}

export async function generateRewardReport(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.REPORT_GENERATEREWARD, "POST", data);
  return result;
}
