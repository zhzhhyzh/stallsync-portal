import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchPasswordPolicyDetail, selectPasswordPolicy } from "@app/redux/passwordPolicy/slice";

function useFetchPasswordPolicyDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectPasswordPolicy);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if(isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
      fetchPasswordPolicyDetail()
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

export default useFetchPasswordPolicyDetail;
