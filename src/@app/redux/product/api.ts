import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listProducts(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_LIST, "GET", data);
  return result;
}

export async function productDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_DETAIL, 'GET', data);
  return result;
}

export async function manageProduct(data: any = {}): Promise<any> {
  const result = await api(data.id ? API_ROUTES.PROD_UPDATE : API_ROUTES.PROD_CREATE, 
  'POST', data);
  return result;
}

export async function removeProduct(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.PROD_DELETE, 'POST', data);
  return result;
}

