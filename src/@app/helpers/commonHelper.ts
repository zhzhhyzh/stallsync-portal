import constants from "../constants/constants";

export function genDocumentUrl(filename: string, type?: string) {
  const hostname = constants.HOSTNAME;
  const nowTs = new Date().getTime();

  return (
    hostname +
    `/document/detail?type=${type || ""}&document=${filename}&ts=${nowTs}`
  );
}

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertWhatsappText(text:string){
  var res = text.replace(/(\*.+\*)/g, function (match: any) {
    return "<strong>" + match.slice(1, -1) + "</strong>"
  });
  var res2 = res.replace(/(~.+~)/g, function (match: any) {
    return "<s>" + match.slice(1, -1) + "</s>"
  });
  var res3 = res2.replace(/(_.+_)/g, function (match: any) {
    return "<i>" + match.slice(1, -1) + "</i>"
  });
  var res4 = res3.replace(/(```.+```)/g, function (match: any) {
    return "<code>" + match.slice(3, -3) + "</code>"
  });
  return res4
}

export function formatFileSize(bytes:number,decimalPoint:number) {
  if(bytes == 0) return '0 Bytes';
  var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}