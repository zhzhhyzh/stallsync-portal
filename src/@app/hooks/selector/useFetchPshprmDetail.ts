import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchPushParamDetail, selectPushNotiParam, setResetPushNotiParamDetail } from "@app/redux/pshprm/slice";

function useFetchPshprmDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectPushNotiParam);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if(isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchPushParamDetail()
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetPushNotiParamDetail());
  }
  return [data, onInit, loading, reset];
}

export default useFetchPshprmDetail;
