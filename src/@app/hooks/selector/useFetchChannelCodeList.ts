import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectExtra, selectChannelCodes, getChannelCodeList, selectChannelCodeTotal  } from "@app/redux/channelCode/slice";

function useFetchChannelCodeList() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectChannelCodes);
  const total = useAppSelector(selectChannelCodeTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  // const uid = String(router.query?.id); //company id
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)



  async function onInit({ page, limit, search }: useFetchChannelCodeProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      getChannelCodeList({
        page: page || 0,
        limit: limit || 10,
        search: search,
        // psmbrphn: psmbrphn || "",
        // psmbrtyp: psmbrtyp || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchChannelCodeProps {
  page?: number;
  limit?: number;
  search?: string;
//   psmbrphn?: string;
//   psmbrtyp?: string;
}

export default useFetchChannelCodeList;