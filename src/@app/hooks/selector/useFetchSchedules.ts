import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchSchedules, selectExtra, selectSchedules, selectSchedulesTotal } from "@app/redux/notificationsheduledetail/slice";

function useFetchSchedules() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectSchedules);
  const total = useAppSelector(selectSchedulesTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search, from, to }: useFetchSchedulesProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchSchedules({
        page: page || 0,
        limit: limit || 10,
        
        search: search || "",
        from: from || "",
        to: to || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchSchedulesProps {
  page?: number;
  limit?: number;
  search?: string;
  from?: string; 
  to?: string;
}

export default useFetchSchedules;