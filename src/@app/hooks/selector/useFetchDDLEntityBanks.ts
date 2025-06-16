import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  fetchDDLEntityBank,
  logout,
  selectEntityBanks,
} from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchDDLEntityBanks(psentuid: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectEntityBanks);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(fetchDDLEntityBank({ psentuid }));
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  return [data, onInit, loading];
}

export default useFetchDDLEntityBanks;
