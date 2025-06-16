import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectExtra, selectTableKeys, fetchTableKeyList, selectTableKeysTotal } from "@app/redux/tableKey/slice";

function useFetchTableKeyListing() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectTableKeys);
  const total = useAppSelector(selectTableKeysTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

//   const pstblnme = String(router.query?.pstblnme);


  useEffect(() => {
    // if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, pstblnme, search }: useFetchTableKeyListingProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchTableKeyList({
        page: page || 0,
        limit: limit || 10,
        pstblnme: pstblnme || "",
        search: search,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }

    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchTableKeyListingProps {
  page?: number;
  limit?: number;
  search?: string;
  pstblnme?: string; //replace with pstblnme
  
}

export default useFetchTableKeyListing;