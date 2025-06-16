import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { getPapparDetail, selectPappar, setResetPapparDetail } from "@app/redux/pappar/slice";



function useFetchPapparDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectPappar);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);


  function reset() {
    dispatch(setResetPapparDetail());
  }

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      getPapparDetail({
        id,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

export default useFetchPapparDetail;
