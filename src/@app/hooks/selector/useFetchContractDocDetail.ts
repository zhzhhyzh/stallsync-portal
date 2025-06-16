import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectApplicationDoc, getApplicationDocDetail, setResetApplicationDocDetail} from "@app/redux/application/slice"
import { getContractDocDetail, selectContractDoc } from "@app/redux/contract/slice";

function useFetchContractDocDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectContractDoc)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  function reset() {
    dispatch(setResetApplicationDocDetail());
  }


  useEffect(() => {
    
    if (id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    console.log()
    const { payload } = await dispatch(
      getContractDocDetail({
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

export default useFetchContractDocDetail;
