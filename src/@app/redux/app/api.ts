import { API_ROUTES } from "@app/routes/apis"
import { api } from "@app/utils/AxiosUtils"

export async function login(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.USER_LOGIN, 'POST', data)
    return result
}

export async function ddl(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.DDL_GENERAL, "GET", data);
    return {
        ...result,
        ddlKey: data.code
    }
}

export async function listMaintlog(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.MAINT_LOG, 'GET', data)
    return result
}

export async function home(): Promise<any> {
    const result = await api(API_ROUTES.HOME, 'GET')
    return result
}

export async function uploadFile(data: any): Promise<any> {
    const result = await api(API_ROUTES.DOCUMENT_UPLOAD, 'POST', data)
    return result
}

export async function uploadBulkFile(data: any): Promise<any> {
    const result = await api(API_ROUTES.DOCUMENT_BULK_UPLOAD, 'POST', data)
    return result
}



export async function ddlAction(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ACTION, 'GET', data)
    return result
}



export async function ddlAvluser(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_AVLUSER, 'GET', data)
    return result
}




export async function ddlRoleCode(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ROLECODE, 'GET', data)
    return result
}


export async function ddlUser(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_USER, 'GET', data)
    return result
}


export async function forgot_password(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.FORGOT_PASSWORD, 'POST', data)
    return result
}
export async function downloadDocument(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DOC_DOWNLOAD, 'POST', data, {},
    false,
    {
      downloadFlag: true,
    });
    return result
}

export async function ddlTableKeys(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_TABLE_KEYS, 'GET', data)
    return result
}


export async function listSubFileMaintlog(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.MAINT_SUBFILE_LOG, 'GET', data)
    return result
}

export async function ddlMchuser(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.DDL_MCHUSER, 'GET', data)
    return result
}

export async function ddlMerchant(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.DDL_MCH, 'GET', data)
    return result
}