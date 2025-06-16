import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAccountMessages, selectAccountMessages, selectAccountMessagesExtra, selectAccountMessagesTotal } from "@app/redux/accountManagement/slice";

function useFetchAccountMessages() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAccountMessages);
  const total = useAppSelector(selectAccountMessagesTotal)
  const extra = useAppSelector(selectAccountMessagesExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, from, to }: useFetchAccountMessagesProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAccountMessages({
        page: page || 0,
        limit: limit || 10,
        from: "",
        to: ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchAccountMessagesProps {
  page?: number;
  limit?: number;
  from?: any;
  to?: any;
}

export default useFetchAccountMessages;