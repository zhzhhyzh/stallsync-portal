import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function checkerMakerList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CHECKER_MAKER_LIST, "GET", data);
  return result;

}

export async function checkerMakerDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CHECKER_MAKER_DETAIL, "GET", data);
  return result;
}

export async function manageCheckerMaker(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.CHECKER_MAKER_UPDATE : API_ROUTES.CHECKER_MAKER_CREATE,
    "POST",
    data
  );
  return result;
}

export async function removeCheckerMaker(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.CHECKER_MAKER_DELETE, "POST", data);
  return result;
}
