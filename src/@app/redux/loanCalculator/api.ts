import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function calculateLoan(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CALCULATE_LOAN, "POST", data);
  return result;
}
