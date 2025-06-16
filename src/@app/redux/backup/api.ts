import { API_ROUTES } from "@app/routes/apis";
import { api } from "@app/utils/AxiosUtils";

export async function listBackup(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.LIST_BACKUP, 'GET', data)
  return result
}

export async function backup(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.BACKUP_GENBACKUP, 'POST', data)
  return result
}

export async function download(data: any = {}): Promise<any> {
  const result = await api(API_ROUTES.DOWNLOAD_BACKUP, 'GET', data, {},
  false,
  {
    downloadFlag: true,
  });

  return result
}
