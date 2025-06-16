import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
// import { getSharedLists,selectExtra , selectSharedLists, selectTotal } from "@app/redux/application/slice";

function useFetchSharedLists(props:any) {
  // const dispatch = useAppDispatch();
  // const router = useRouter();

  // const data = useAppSelector(selectSharedLists);
  // const total = useAppSelector(selectTotal)
  // const extra = useAppSelector(selectExtra)
  // const [loading, setLoading] = useState(false);
  // const isLogined = useAppSelector(selectIsLogined);

  // useEffect(() => {
  //   // if (isLogined) onInit({});
  // }, [isLogined]);

  // async function onInit({ page, limit }: useFetchSharedListsProps) {
  //   setLoading(true);
  //   const { payload } = await dispatch(
  //     getSharedLists({
  //       page: page || 0,
  //       limit: limit || 10,
  //       ...props,
  //     })
  //   );

  //   if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
  //     dispatch(logout());
  //   }
  //   setLoading(false);
  // }
  // return [data, onInit, total, extra, loading];
}

interface useFetchSharedListsProps {
  page?: number;
  limit?: number;
}

export default useFetchSharedLists;
