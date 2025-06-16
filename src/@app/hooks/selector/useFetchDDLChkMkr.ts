import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, selectTableKeys, fetchDDLTableKeys, selectDDLChkMkr, fetchDDLCheckerMaker } from "@app/redux/app/slice";

import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchDDLChkMkr() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectDDLChkMkr);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
      setLoading(true);
      const { payload } = await dispatch(fetchDDLCheckerMaker({}));
      console.log("payload", payload);
      if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
        dispatch(logout());
      }
      setLoading(false);
  }

  return [data, onInit, loading];
}

export default useFetchDDLChkMkr;
