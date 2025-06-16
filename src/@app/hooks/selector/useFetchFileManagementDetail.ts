import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectFileManagement, getFileManagementDetail, setResetFileManagementDetail } from "@app/redux/fileManage/slice"

function useFetchFileManagementDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectFileManagement);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  function reset() {
    dispatch(setResetFileManagementDetail)
  }

  async function onInit() {
    setLoading(true);

    reset();

    const { payload } = await dispatch(
        getFileManagementDetail({
          id,
      })
    ); //fire api (call action)

    if(payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

export default useFetchFileManagementDetail;