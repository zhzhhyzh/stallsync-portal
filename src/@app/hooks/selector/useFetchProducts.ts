import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchProducts, selectExtra, selectProducts, selectTotal, selectHeader } from "@app/redux/product/slice";

function useFetchProducts(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectProducts);
  const total = useAppSelector(selectTotal)
  const extra = useAppSelector(selectExtra)
  const headerInfo = useAppSelector(selectHeader)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);

  async function onInit({ page, limit }: useFetchProductsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      fetchProducts({
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
  return [data, onInit, total, extra, headerInfo, loading,];
}

interface useFetchProductsProps {
  page?: number;
  limit?: number;
}

export default useFetchProducts;