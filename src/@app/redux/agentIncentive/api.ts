import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";



export async function listAgent(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.AGENT_LIST, "GET", data);
  return result;
}

export async function agentDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.AGENT_DETAIL, 'GET', data);
  return result;
}

export async function manageAgent(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.AGENT_UPDATE : API_ROUTES.AGENT_CREATE, 
  'POST', data);
  return result;
}

export async function removeAgent(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.AGENT_DELETE, 'POST', data);
  return result;
}

