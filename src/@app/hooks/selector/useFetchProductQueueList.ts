import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchProductList, selectExtra, selectProducts, selectProductsTotal } from "@app/redux/product/slice";

function useFetchProductQueueList({ page, limit, prquecod }: useFetchProductQueueProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectProducts);
  const total = useAppSelector(selectProductsTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    // if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit }: useFetchProductQueueProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchProductList({
        page: page || 0,
        limit: limit || 10,
        prquecod
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

interface useFetchProductQueueProps {
  page?: number;
  limit?: number;
  prquecod?: string;
//   functionCode?: string; 
}

export default useFetchProductQueueList;
