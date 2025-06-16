import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchMaintlogs, logout, selectMaintLog, selectMaintTotal, selectMaintExtra, selectIsLogined} from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchMaintLogs({ page, limit }: useFetchMaintLogsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectMaintLog);
  const total = useAppSelector(selectMaintTotal);
  const extra = useAppSelector(selectMaintExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if(isLogined) onInit();
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchMaintlogs({
        page: page || 0,
        limit: limit || 10,
        // file: file || "",
        // key: id || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, extra, onInit, total, loading];
}

interface useFetchMaintLogsProps {
  page?: number;
  limit?: number;
  // file?: string;
  // id?: string;
}

export default useFetchMaintLogs;