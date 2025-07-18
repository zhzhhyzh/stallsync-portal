import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAccessibility, selectAccessibility, selectAccessibilityTotal } from "@app/redux/accessibility/slice";

function useFetchAccessibility() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAccessibility);
  const total = useAppSelector(selectAccessibilityTotal)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAccessibility({})
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, loading];
}

export default useFetchAccessibility;