import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchGenCode, selectGeneralCodes, selectTotalCode, selectExtraCode  } from "@app/redux/generalParam/slice";

function useFetchGeneralCode({ page, limit, id }: useFetchGeneralCodeProps)  {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectGeneralCodes);
  const total = useAppSelector(selectTotalCode)
  const extra = useAppSelector(selectExtraCode)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    
    // if(isLogined && id !== "undefined") {
    //   onInit();
    // }
    // onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchGenCode({
        page: page || 0,
        limit: limit || 10,
        prgtycde: id, 

      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchGeneralCodeProps {
  page?: number;
  limit?: number;
  id?: string;

}

export default useFetchGeneralCode;