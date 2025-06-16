import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listAccount(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_LIST, "GET", data);
  return result;
}

export async function listAccountDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_DETAIL_LIST, "GET", data);
  return result;
}

export async function accountDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_DETAIL, "GET", data);
  return result;
}

export async function preCalculate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_PRE_CALCULATE, "POST", data);
  return result;
}

export async function listBilling(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_BILLING_LIST, "GET", data);
  return result;
}

export async function listTransaction(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_TRANSACTION_LIST, "GET", data);
  return result;
}

export async function listCustomerRelationship(data: any = {}): Promise<any> {
  const result = await api(
    API_ROUTES.ACCOUNT_CUSTOMER_RELATIONSHIP_LIST,
    "GET",
    data
  );
  return result;
}

export async function listAccountRelationship(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_RELATIONSHIP_LIST, "GET", data);
  return result;
}

export async function listAccountMessage(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_MESSAGE_LIST, "GET", data);
  return result;
}

export async function raiseRequest(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.MANUAL_TRANS_RAISE_REQ, "POST", data);
  return result;
}

export async function accountDetailUpdate(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.ACCOUNT_DETAIL_UPDATE, "POST", data);
  return result;
}