import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectProdFee, getProdFeeDetail, setResetProdFeeDetail} from "@app/redux/prodFee/slice"

function useFetchProdFeeDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectProdFee);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  function reset() {
    dispatch(setResetProdFeeDetail());
  }

  useEffect(() => {
    if (id && id !== null && id !== "undefined") onInit();
    // console.log("HERE",id)
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      getProdFeeDetail({
          id,
      })
    ); //fire api (call action)

    if (payload?.code === "token_not_valid" || payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, loading];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchProdFeeDetail;
