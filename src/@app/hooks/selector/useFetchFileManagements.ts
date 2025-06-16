import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

import { fetchFileManagementList, selectFileManagements, selectExtra, selectFileManagementsTotal } from "@app/redux/fileManage/slice";

function useFetchFileManagements() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectFileManagements);
  const total = useAppSelector(selectFileManagementsTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit }: useFetchFileManagementsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchFileManagementList({
        page: page || 0,
        limit: limit || 10,
        // prfuncde: functionCode || ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  
  return [data, onInit, total, extra, loading];
}

interface useFetchFileManagementsProps {
  page?: number;
  limit?: number;
//   functionCode?: string; 
}

export default useFetchFileManagements;