import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectworkday, getworkDayDetail, setResetworkDayDetail } from "@app/redux/workday/slice"

function useFetchWorkDayDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectworkday);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  function reset() {
    dispatch(setResetworkDayDetail());
  }

  useEffect(() => {
    if (id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      getworkDayDetail({
        id,
      })
    ); //fire api (call action)

    if (payload?.code === "token_not_valid") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchWorkDayDetail;
