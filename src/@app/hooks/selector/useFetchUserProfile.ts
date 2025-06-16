import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchUserProfile, selectProfile } from "@app/redux/user/slice";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchUserProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
  }, []);

  useEffect(() => {
    onInit();
  }, [isLogined]);

  async function onInit() {
    if (!isLogined) return;
    setLoading(true);
    const { payload } = await dispatch(fetchUserProfile());
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  
  return [data.message, onInit, loading];
}

export default useFetchUserProfile;