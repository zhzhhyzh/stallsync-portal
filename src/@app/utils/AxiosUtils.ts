import axios from "axios";
var fileDownload = require("js-file-download");

interface extraType {
  downloadFlag: boolean;
}
const extraDefault = {
  downloadFlag: false,
};

export async function api(
  requestURL: string,
  requestMethod: string = "GET",
  data: any = {},
  headers: any = {},
  noToken: boolean = false,
  { downloadFlag }: extraType = extraDefault
): Promise<any> {
  const domainUrl = process.env.NEXT_PUBLIC_API_URL;
  if (requestURL.indexOf("https://") < 0 && requestURL.indexOf("http://") < 0) {
    requestURL = `${domainUrl}/${requestURL}`;
  }

  let locale = "en";
  headers = {
    ...headers,
    "api-key": process.env.NEXT_PUBLIC_API_KEY,
    locale,
  };

  const token = localStorage.getItem("AUTH_TOKEN");
  if (token && !noToken && token !== "undefined") {
    headers = {
      ...headers,
      Authorization: token,
    };
  }

  let axiosBody: any = {
    method: requestMethod,
    url: requestURL,
    headers,
    timeout: 1000 * 60 * 2, // 2mins
    // locale,
  };

  if (requestMethod === "GET") {
    axiosBody = {
      ...axiosBody,
      params: data,
    };
  } else if (
    requestMethod === "POST" ||
    requestMethod === "PUT" ||
    requestMethod === "PATCH"
  ) {
    axiosBody = {
      ...axiosBody,
      data,
    };
  }

  if (downloadFlag) {
    axiosBody = {
      ...axiosBody,
      responseType: "blob",
    };
  }

  return axios(axiosBody)
    .then((response) => {
      if (downloadFlag) {
        if (response.data) {
          const contentDispositionHeader =
            response.headers["content-disposition"];

          let filename = "";
          if (
            contentDispositionHeader &&
            contentDispositionHeader.indexOf("attachment") !== -1
          ) {
            let fileRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matchFileName = fileRegex.exec(contentDispositionHeader);
            if (matchFileName != null && matchFileName[1]) {
              filename = matchFileName[1].replace(/['"]/g, "");
            }
          } else {
            const contentTypeHeader = response.headers["content-type"];
            const fileType = contentTypeHeader.split(";")[0].trim();
            const fileExtension = getFileExtension(fileType);
            filename =
              data.filename.indexOf(fileExtension) !== -1
                ? data.filename
                : data.filename + fileExtension;
          }

          fileDownload(response.data, filename);
        }
      } else {
        return {
          ...response.data,
          httpCode: response.status,
        };
      }
    })
    .catch((error) => {
      if (error.code === "ERR_BAD_RESPONSE") {
        // throw new Error(error)
        return {
          httpCode: 500,
          message: error?.message || "Unexpected error",
          responseMessage: error?.response?.data?.message,
        };
      }
      return {
        ...error.response.data,
        httpCode: error.response.status,
      };
    });
}

function getFileExtension(fileType: string) {
  switch (fileType) {
    case "application/pdf":
      return ".pdf";
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "text/csv":
    case "text/comma-separated-values":
      return ".csv";
    case "application/vnd.ms-excel":
      return ".xls";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return ".xlsx";
    case "application/vnd.ms-powerpoint":
      return ".ppt";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return ".pptx";
    case "text/plain":
      return ".txt";
    case "application/msword":
      return ".doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";
    default:
      return "";
  }
}