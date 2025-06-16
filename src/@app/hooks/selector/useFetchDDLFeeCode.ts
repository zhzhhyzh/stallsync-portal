import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchDDLFeeCode, logout, selectFeeCode } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchDDLFeeCode() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectFeeCode);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
      setLoading(true);
      const { payload } = await dispatch(fetchDDLFeeCode({}));
      if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
        dispatch(logout());
      }
      setLoading(false);
  }

  return [data, onInit, loading];
}

export default useFetchDDLFeeCode;
