import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import {
  fetchProductsR,
  selectExtra,
  selectProductsR,
  selectTotal,
} from "@app/redux/inventory/slice";

function useFetchProductsR(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectProductsR);
  const total = useAppSelector(selectTotal);
  const extra = useAppSelector(selectExtra);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && props?.prodId && props?.psinvsty) {
      onInit({});
    }
  }, [isLogined, props?.prodId, props?.psinvsty]);

  async function onInit({ page, limit }: useFetchProductsRProps) {
    setLoading(true);
    const { payload } = await dispatch(
      fetchProductsR({
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

interface useFetchProductsRProps {
  page?: number;
  limit?: number;
}

export default useFetchProductsR;
