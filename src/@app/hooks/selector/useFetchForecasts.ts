import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchForecastView, selectOrders, selectSales } from "@app/redux/reports/slice";
function useFetchForecasts(prrptnme: string, prrptfcs: string, prrptfco: string): [
  any, // sales
  () => Promise<void>, // fetchInit
  any, // order
  boolean // loading
] {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const order = useAppSelector(selectOrders);
  const sales = useAppSelector(selectSales);
  const [loading2, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
      fetchForecastView({ prrptnme, prrptfcs, prrptfco })
    );
    if (payload?.code === "UNAUTHORIZED") {
      dispatch(logout());
    }
    setLoading(false);
  }

  return [sales, onInit, order, loading2];
}


export default useFetchForecasts;
