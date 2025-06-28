import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listTransactions(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TRAN_LIST, "GET", data);
  return result;
}

export async function transactionDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.TRAN_DETAIL, 'GET', data);
  return result;
}
