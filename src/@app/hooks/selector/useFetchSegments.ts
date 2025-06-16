import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchSegments, selectExtra, selectSegments, selectSegmentsTotal } from "@app/redux/segment/slice";

function useFetchSegments() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectSegments);
  const total = useAppSelector(selectSegmentsTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search, status }: useFetchSegmentsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchSegments({
        page: page || 0,
        limit: limit || 10,
        // psusrunm: userId || "",
        // psusrnam: userName || "",
        search: search || "",
        pssegsts: status || ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchSegmentsProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; 
}

export default useFetchSegments;