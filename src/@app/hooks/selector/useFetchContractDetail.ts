import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { getContractDetail, selectContract, setResetContractDetail } from "@app/redux/contract/slice";

function useFetchContractDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectContract);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined"){
       onInit(id);
    }
  }, [isLogined]);

  async function onInit(id:string|number) {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      getContractDetail({
        id,
      })); //fire api (call action)
      
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetContractDetail());
  }

  return [data, onInit, loading, reset];
}

export default useFetchContractDetail;
