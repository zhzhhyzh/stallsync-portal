import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listProductsR(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.INV_LIST, "GET", data);
  return result;
}

export async function productRDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.INV_DETAIL, 'GET', data);
  return result;
}

export async function manageProductR(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.INV_UPDATE : API_ROUTES.INV_CREATE, 
  'POST', data);
  return result;
}

// export async function removeProduct(data: any = {}): Promise<any> {
//   const result = await api(API_ROUTES.INV_DELETE, 'POST', data);
//   return result;
// }

