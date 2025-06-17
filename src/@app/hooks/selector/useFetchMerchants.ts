import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchmerchants, selectExtra, selectMerchants, selectTotal } from "@app/redux/merchant/slice";

function useFetchMerchants(props:any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectMerchants);
  const total = useAppSelector(selectTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);

  async function onInit({ page, limit }: useFetchMerchantsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      fetchmerchants({
        page: page || 0,
        limit: limit || 10,
        ...props,
      })
    );

    if (payload?.code === "UNAUTHORIZED") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchMerchantsProps {
  page?: number;
  limit?: number;
}

export default useFetchMerchants;