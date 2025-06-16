import { useState, useEffect } from "react";

import {} from "@app/redux/dashboard/slice";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import { useBoolean } from "@chakra-ui/react";

function useApi(props?: { title?: string }) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useBoolean();
  const [payload, setPayload] = useState({});

  async function sendRequest({ fn, formik }: { fn: any; formik?: any }) {
    setLoading.toggle();
    const { payload } = await dispatch(fn);
    setLoading.toggle();
    setPayload(payload);
    if (payload?.httpCode >= 400 && typeof payload?.message === "string") {
      //show commong message (not field message)
      showModal(dispatch, {
        title: props?.title || "Request",
        message: payload?.responseMessage?.error || payload?.message || "Unexpected Error",
        status: "error",
      });
    } else if (
      payload?.httpCode >= 400 &&
      typeof payload?.message === "object"
    ) {
     
      formik && formik?.setErrors(payload?.message || "");



    }
    //return payload for developer want to get payload direct from sendRequest
    return { ...payload, success: payload?.httpCode < 400 ? true : false, message: payload?.message };
  }

  return { sendRequest, payload, loading };
}

export default useApi;
