import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchDDLUser, logout, selectUser } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchDDLUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
      setLoading(true);
      const { payload } = await dispatch(fetchDDLUser({}));
      if (payload?.code === "UNAUTHORIZED") {
        dispatch(logout());
      }
      setLoading(false);
  }

  return [data, onInit, loading];
}

export default useFetchDDLUser;
