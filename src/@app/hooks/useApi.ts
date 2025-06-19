import { useState } from "react";
import { useAppDispatch } from "@app/hooks/useRedux";
import { showModal } from "@app/helpers/modalHelper";
import { useBoolean } from "@chakra-ui/react";

function useApi(props?: { title?: string }) {
  const dispatch = useAppDispatch();
  const [loading, { on: setLoadingTrue, off: setLoadingFalse }] = useBoolean();
  const [payload, setPayload] = useState({});

  async function sendRequest({ fn, formik }: { fn: any; formik?: any }) {
    setLoadingTrue();
    const { payload } = await dispatch(fn);
    setLoadingFalse();
    setPayload(payload);

    if (payload?.httpCode >= 400 && typeof payload?.message === "string") {
      showModal(dispatch, {
        title: props?.title || "Request",
        message:
          payload?.responseMessage?.error ||
          payload?.message ||
          "Unexpected Error",
        status: "error",
      });
    } else if (
      payload?.httpCode >= 400 &&
      typeof payload?.message === "object"
    ) {
      formik && formik?.setErrors(payload?.message || "");
    }

    return {
      ...payload,
      success: payload?.httpCode < 400 ? true : false,
      message: payload?.message,
    };
  }

  return { sendRequest, payload, loading };
}

export default useApi;