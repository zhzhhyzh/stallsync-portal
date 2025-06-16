import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import {
  fetchEntityTreeList,
  selectEntityTree,
  // setResetEntityDetail,
} from "@app/redux/entity/slice";

function useFetchEntityTreeView() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  let data = useAppSelector(selectEntityTree);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
     onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchEntityTreeList({
        // id,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    // dispatch(setResetGenTypeDetail());
  }

  return [data, onInit, loading, reset];
}

// interface useFetchAdminAccountsDetailProps {
//   id: string;
// }

export default useFetchEntityTreeView;