import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectExtra, list, selectTotal, selectTestReceivers } from "@app/redux/testReceiver/slice";

function useFetchTestReceivers(type:String) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectTestReceivers);
  const total = useAppSelector(selectTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({type});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, type }: useFetchTestReceiverProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      list({
        page: page || 0,
        limit: limit || 10,
        pstrctyp:type
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchTestReceiverProps {
  page?: number;
  limit?: number;
  type?: String;

}

export default useFetchTestReceivers;