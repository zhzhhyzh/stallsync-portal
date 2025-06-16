import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import {
  fetchAdminDetail,
  selectAdminAccount,
  setResetAdminAccountsDetail,
} from "@app/redux/adminAccounts/slice";

function useFetchAdminAccountsDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAdminAccount);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchAdminDetail({
        id,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetAdminAccountsDetail());
  }

  return [data, onInit, loading, reset];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchAdminAccountsDetail;