import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import {
  fetchGenCodeDetail,
  selectGeneralCode,
  setResetGenCodeDetail,
} from "@app/redux/generalParam/slice";

function useFetchGeneralCodeDetail(id: string, genCode: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectGeneralCode);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    //Reset the Detail Data before next api call
    reset();
    const { payload } = await dispatch(
      fetchGenCodeDetail({
        prgtycde: id,
        prgecode: genCode
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetGenCodeDetail());
  }

  return [data, onInit, loading, reset];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchGeneralCodeDetail;