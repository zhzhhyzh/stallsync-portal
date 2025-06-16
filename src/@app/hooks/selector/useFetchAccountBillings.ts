import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAccountBillings, selectBillingsAccount, selectBillingsAccountExtra, selectBillingsAccountTotal } from "@app/redux/accountManagement/slice";

function useFetchAccountBillings() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectBillingsAccount);
  const total = useAppSelector(selectBillingsAccountTotal)
  const extra = useAppSelector(selectBillingsAccountExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search }: useFetchAccountBillingsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAccountBillings({
        page: page || 0,
        limit: limit || 10,
        accNo: search || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchAccountBillingsProps {
  page?: number;
  limit?: number;
  search?: string;
}

export default useFetchAccountBillings;