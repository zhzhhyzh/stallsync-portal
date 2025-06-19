import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listRewards(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.RWD_LIST, "GET", data);
  return result;
}

export async function rewardDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.RWD_DETAIL, 'GET', data);
  return result;
}

export async function manageReward(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.RWD_UPDATE : API_ROUTES.RWD_CREATE,
    'POST', data);
  return result;
}

export async function removeReward(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.RWD_DELETE, 'POST', data);
  return result;
}

