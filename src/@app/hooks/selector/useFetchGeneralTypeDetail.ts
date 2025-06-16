import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import {
  fetchGenTypeDetail,
  selectGeneralType,
  setResetGenTypeDetail,
} from "@app/redux/generalParam/slice";

function useFetchGeneralTypeDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  let data = useAppSelector(selectGeneralType);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchGenTypeDetail({
        id,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetGenTypeDetail());
  }

  return [data, onInit, loading, reset];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchGeneralTypeDetail;