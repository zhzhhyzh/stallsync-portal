import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function queueList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_LIST, "GET", data);
  return result;
}

export async function queueDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_DETAIL, "GET", data);
  return result;
}

export async function manageQueue(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.QUEUE_EDIT : API_ROUTES.QUEUE_CREATE,
    "POST",
    data
  );
  return result;
}

export async function deleteQueue(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_DELETE, "POST", data);
  return result;
}


//activity
export async function actList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_ACTLIST, "GET", data);
  return result;
}

export async function actDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_ACTDETAIL, "GET", data);
  return result;
}

export async function manageAct(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.QUEUE_EDITACT : API_ROUTES.QUEUE_CREATEACT,
    "POST",
    data
  );
  return result;
}

export async function deleteAct(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_DELETEACT, "POST", data);
  return result;
}

//ACTIVITY CHKLIST
export async function actChkList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_ACTCHKLIST, "GET", data);
  return result;
}

export async function actChkDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_ACTCHKDETAIL, "GET", data);
  return result;
}

export async function manageActChk(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.QUEUE_EDITACTCHK : API_ROUTES.QUEUE_CREATEACTCHK,
    "POST",
    data
  );
  return result;
}

export async function deleteActChk(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_DELETEACTCHK, "POST", data);
  return result;
}

//Activity Actions
export async function actActList(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_ACTACTLIST, "GET", data);
  return result;
}

export async function actActDetail(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_ACTACTDETAIL, "GET", data);
  return result;
}

export async function manageActAct(data: any = {}): Promise<any> {
  const result = await api(
    data.id ? API_ROUTES.QUEUE_EDITACTACT : API_ROUTES.QUEUE_CREATEACTACT,
    "POST",
    data
  );
  return result;
}

export async function deleteActAct(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_DELETEACTACT, "POST", data);
  return result;
}

export async function actchkactactfind(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.QUEUE_CHKFIND, "GET", data);
  return result;
}


