import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function memberList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MEMBER_LIST, "GET", data);
  return result;

}
export async function memberSales(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MEMBER_SALES, "GET", data);
  return result;

}

export async function memberDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MEMBER_DETAIL, "GET", data);
  return result;
}
export async function memberProfile(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MEMBER_PROFILE, "GET", data);
  return result;
}

export async function manageMember(data: any = {}): Promise<any> {
  const result = await api(
     API_ROUTES.MEMBER_CREATE,
    "POST",
    data
  );
  return result;
} 

export async function updateProfile(data: any = {}): Promise<any> {
  const result = await api(
     API_ROUTES.MEMBER_UPDATE_PROFILE,
    "POST",
    data
  );
  return result;
} 

