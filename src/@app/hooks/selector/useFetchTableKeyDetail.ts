import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchTableKeyDetail, selectTableKey, setResetTableKeyDetail } from "@app/redux/tableKey/slice";

function useFetchTableKeyDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectTableKey);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  function reset(){
    dispatch(setResetTableKeyDetail());
  }

  async function onInit() {
    setLoading(true);

    reset();
    const { payload } = await dispatch(
        fetchTableKeyDetail({
        id,
      })); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

export default useFetchTableKeyDetail;