import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchDDL, logout, selectDDL } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchDDL({ code }: useFetchDDLProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectDDL);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
    for (const c of code) {
      setLoading(true);
      const { payload } = await dispatch(fetchDDL({ code: c }));
      if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
        dispatch(logout());
      }
      setLoading(false);
    }
  }

  return [data, onInit, loading];
}

interface useFetchDDLProps {
  code: string[];
}

export default useFetchDDL;