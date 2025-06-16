import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchworkday, selectExtra, selectworkDays, selectTotal } from "@app/redux/workday/slice";

function useFetchWorkDays(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectworkDays);
  const total = useAppSelector(selectTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    // if (isLogined) onInit({});
  }, [isLogined]);

  async function onInit({ page, limit }: useFetchWorkDaysCodesProps) {
    setLoading(true);
    const { payload } = await dispatch(
      fetchworkday({
        page: page || 0,
        limit: limit || 10,
        pswdyind: props || "",
      })
    );

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchWorkDaysCodesProps {
  page?: number;
  limit?: number;
}

export default useFetchWorkDays;
