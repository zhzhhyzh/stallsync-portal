import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchQueueList, selectqueueExtra, selectqueues, selectqueueTotal, setResetQueueDetail } from "@app/redux/queue/slice";

function useFetchQueues() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectqueues);
  const total = useAppSelector(selectqueueTotal)
  const extra = useAppSelector(selectqueueExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  function reset(){
    dispatch(setResetQueueDetail());
  }
  async function onInit({ page, limit }: useFetchQueuesProps) {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchQueueList({
        page: page || 0,
        limit: limit || 10,
        // prfuncde: functionCode || ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
    console.log("Data......", data);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchQueuesProps {
  page?: number;
  limit?: number;
  //   functionCode?: string; 
}

export default useFetchQueues;
