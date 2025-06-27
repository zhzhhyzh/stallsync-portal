import { API_ROUTES } from "@app/routes/apis"
import { api } from "@app/utils/AxiosUtils"

export async function getMain(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.DASHBOARD_MAIN, 'GET',data)
    return result
}
export async function getTop10(data: any = {}): Promise<any> {
    const result = await api(API_ROUTES.DASHBOARD_TOP_10, 'GET',data)
    return result
}
