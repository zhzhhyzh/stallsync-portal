import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function personalCommissionListing(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PERSONAL_COMMISSION_LISTING, "GET", data);
  return result;

}

export async function groupCommissionListing(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.GROUP_COMMISSION_LISTING, "GET", data);
  return result;
}
export async function commissionListing(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.COMMISSION_LISTING, "GET", data);
  return result;
}
