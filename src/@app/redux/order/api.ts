import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listOrders(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ORDER_LIST, "GET", data);
  return result;
}

export async function orderDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ORDER_DETAIL, 'GET', data);
  return result;
}

export async function manageOrder(data: any = {}): Promise<any> {
  let route = "";

  if (data.id) {
    switch (data.status) {
      case "N":
        route = API_ROUTES.ORDER_PAID;
        break;
      case "P":
        route = API_ROUTES.ORDER_READY;
        break;
      case "A":
        route = API_ROUTES.ORDER_DONE;
        break;
      default:
        route = API_ROUTES.ORDER_CANCEL;
    }
  } else {
    route = API_ROUTES.ORDER_CANCEL;
  }

  const result = await api(route, 'POST', data);
  return result;
}


// export async function removeProduct(data: any = {}): Promise<any> {
//   const result = await api(API_ROUTES.PROD_DELETE, 'POST', data);
//   return result;
// }

