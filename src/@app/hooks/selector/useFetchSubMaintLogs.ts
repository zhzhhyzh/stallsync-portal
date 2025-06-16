import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchSubFileMaintlogs, logout, selectIsLogined, selectSubMaintLog, selectSubMaintTotal} from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchSubMaintLogs({ page, limit }: useFetchSubMaintLogsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectSubMaintLog);
  const total = useAppSelector(selectSubMaintTotal);
  //const extra = useAppSelector(selectMaintExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if(isLogined) onInit();
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchSubFileMaintlogs({
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
  return [data, onInit, total, loading];
}

interface useFetchSubMaintLogsProps {
  page?: number;
  limit?: number;
  // file?: string;
  // id?: string;
}

export default useFetchSubMaintLogs;