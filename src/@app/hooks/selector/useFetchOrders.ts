import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchOrders, selectExtra, selectOrders, selectTotal , selectHeader} from "@app/redux/order/slice";

function useFetchOrders(props:any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectOrders);
  const total = useAppSelector(selectTotal)
  const extra = useAppSelector(selectExtra)
  const headerInfo = useAppSelector(selectHeader)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);

  async function onInit({ page, limit }: useFetchOrdersProps) {
    setLoading(true);
    const { payload } = await dispatch(
      fetchOrders({
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
  return [data, onInit, total, extra, loading, headerInfo];
}

interface useFetchOrdersProps {
  page?: number;
  limit?: number;
}

export default useFetchOrders;