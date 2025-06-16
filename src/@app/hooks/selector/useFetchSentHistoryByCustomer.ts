import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchHistoriesByCustomer, selectSentHistoriesByCustomer, selectSentHistoriesByCustomerExtra, selectSentHistoriesByCustomerTotal } from "@app/redux/notificationSentHistory/slice";

function useFetchSentHistoriesByCustomer() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectSentHistoriesByCustomer);
  const total = useAppSelector(selectSentHistoriesByCustomerTotal)
  const extra = useAppSelector(selectSentHistoriesByCustomerExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search }: useFetchSentHistoriesByCustomerProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchHistoriesByCustomer({
        page: page || 0,
        limit: limit || 10,
        search: search || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchSentHistoriesByCustomerProps {
  page?: number;
  limit?: number;
  search?: string;
}

export default useFetchSentHistoriesByCustomer;