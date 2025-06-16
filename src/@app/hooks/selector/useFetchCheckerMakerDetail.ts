import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { getCheckerMakerDetail, selectCheckerMaker, setResetCheckerMakerDetail } from "@app/redux/checkerMaker/slice";

function useFetchCheckerMakerDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectCheckerMaker);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      getCheckerMakerDetail({
        id,
      })); //fire api (call action)
      
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetCheckerMakerDetail());
  }

  return [data, onInit, loading, reset];
}

export default useFetchCheckerMakerDetail;
