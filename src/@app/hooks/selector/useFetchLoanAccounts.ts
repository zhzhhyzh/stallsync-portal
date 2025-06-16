import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchLoanAccounts, selectExtra, selectLoanAccounts, selectLoanAccountsTotal } from "@app/redux/accountManagement/slice";

function useFetchLoanAccounts() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectLoanAccounts);
  const total = useAppSelector(selectLoanAccountsTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search, type }: useFetchLoanAccountsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchLoanAccounts({
        page: page || 0,
        limit: limit || 10,
        search: search || "",
        type: type || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchLoanAccountsProps {
  page?: number;
  limit?: number;
  search?: string;
  type?: string; 
}

export default useFetchLoanAccounts;