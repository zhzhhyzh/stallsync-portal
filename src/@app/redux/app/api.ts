import { API_ROUTES } from "@app/routes/apis"
import { api } from "@app/utils/AxiosUtils"

export async function login(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.USER_LOGIN, 'POST', data)
    return result
}
// export async function register(data: any = {}): Promise<any> {
//     const result = await api(API_ROUTES.USER_LOGIN, 'POST', data)
//     return result
// }
export async function ddlChkMkrParam(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_CHK_MKR, 'GET', data)
    return result
}
export async function ddlCompany(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.COMPANY_DDL, 'GET', data)
    return result
}
export async function ddlAgent(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_AGENT, 'GET', data)
    return result
}
export async function ddlProduct(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_PRODUCT, 'GET', data)
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

export async function ddlTransCode(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_TRANSCODE, 'GET', data)
    return result
}

export async function ddlDsagent(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_DSAGENT, 'GET', data)
    return result
}

export async function ddlAction(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ACTION, 'GET', data)
    return result
}
export async function ddlEntity(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ENTITY, 'GET', data)
    return result
}
export async function ddlCurrency(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_CURRENCY, 'GET', data)
    return result
}

export async function ddlAvluser(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_AVLUSER, 'GET', data)
    return result
}

export async function ddlPriceCode(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_PRICODE, 'GET', data)
    return result
}
export async function ddlFeeCode(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_FEECODE, 'GET', data)
    return result
}

export async function ddlGlacpf(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_GLACPF, 'GET', data)
    return result
}
export async function ddlTaxpar(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_TAXPAR, 'GET', data)
    return result
}

export async function ddlRoleCode(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ROLECODE, 'GET', data)
    return result
}

export async function ddlActWrkGrp(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ACTWRKGRP, 'GET', data)
    return result
}
export async function ddlUser(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_USER, 'GET', data)
    return result
}
export async function ddlProdCode(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_PROCODE, 'GET', data)
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
export async function ddlWorkgroups(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_WORKGROUPS, 'GET', data)
    return result
}

export async function listSubFileMaintlog(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.MAINT_SUBFILE_LOG, 'GET', data)
    return result
}

export async function ddlEntityBank(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_ENTITY_BANK, 'GET', data)
    return result
}

export async function notificationMetadata(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.NOT_METADATA, 'GET', data)
    return result
}

export async function notificationGroupDDL(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_NOTIFICATION_GROUP, 'GET', data)
    return result
}

export async function ddlChannelSender(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_CHANNEL_SENDER, 'GET', data)
    return result
}

export async function ddlCustomer(data: any = []): Promise<any> {
    const result = await api(API_ROUTES.DDL_CUSTOMER, 'GET', data)
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