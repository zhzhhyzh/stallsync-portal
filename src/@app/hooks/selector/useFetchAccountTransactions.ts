import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAccountTransactions, selectAccountTransaction, selectAccountTransactionExtra, selectAccountTransactionTotal } from "@app/redux/accountManagement/slice";

function useFetchAccountTransactions() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAccountTransaction);
  const total = useAppSelector(selectAccountTransactionTotal)
  const extra = useAppSelector(selectAccountTransactionExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, type, from, to }: useFetchAccountTransactionsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAccountTransactions({
        page: page || 0,
        limit: limit || 10,
        type: type || "",
        from: "",
        to: ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchAccountTransactionsProps {
  page?: number;
  limit?: number;
  type?: string;
  from?: any;
  to?: any;
}

export default useFetchAccountTransactions;