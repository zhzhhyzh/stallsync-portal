import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listRoleCode(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.ROLE_LIST, "GET", data);
    return result;
}

export async function roleCodeDetail(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.ROLE_DETAIL, 'GET', data);
    return result;
}

export async function manageRoleCode(data: any = {}): Promise<any> {
    const result = await api(data.id ? API_ROUTES.ROLE_UPDATE : API_ROUTES.ROLE_CREATE,
        'POST', data);
    return result;
}

export async function removeRoleCode(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.ROLE_DELETE, 'POST', data);
    return result;
}

