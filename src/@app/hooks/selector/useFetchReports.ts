import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchReports, selectReports, selectReportsTotal, selectExtra } from "@app/redux/reports/slice";

function useFetchReports() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectReports);
  const total = useAppSelector(selectReportsTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, }: useFetchReportsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchReports({
        page: page || 0,
        limit: limit || 10,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchReportsProps {
  page?: number;
  limit?: number;
}

export default useFetchReports;
