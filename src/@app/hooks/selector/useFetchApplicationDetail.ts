import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectApplication, getApplicationDetail, setResetApplicationDetail } from "@app/redux/application/slice"

function useFetchApplicationDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectApplication);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  function reset() {
    dispatch(setResetApplicationDetail());
  }

  useEffect(() => {
    // console.log(id)

    if (id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();

    const { payload } = await dispatch(
      getApplicationDetail({
        id,
      })
    ); //fire api (call action)
    if (payload?.code === "token_not_valid") {
      dispatch(logout());
    }

    setLoading(false);
  }
  return [data, onInit, loading, reset];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchApplicationDetail;
