import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function promotionList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROMOTION_LISTING, "GET", data);
  return result;

}

export async function promotionSales(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROMOTION_SALES, "GET", data);
  return result;

}
export async function downlinePromotion(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROMOTION_DOWNLINE_PROMOTION, "GET", data);
  return result;

}
export async function recruitListing(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROMOTION_RECRUITS_LISTING, "GET", data);
  return result;

}
export async function promotionDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROMOTION_DETAIL, "GET", data);
  return result;

}
export async function updatePromotion(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROMOTION_UPDATE, "POST", data);
  return result;

}
