import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchActActDetail, selectActAct, setResetActActDetail } from "@app/redux/queue/slice";

function useFetchActActDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectActAct);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  function reset() {
    dispatch(setResetActActDetail());
  }
  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchActActDetail({
        id: id,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

export default useFetchActActDetail;
