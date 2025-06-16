import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchLoanDetailsAccounts, selectExtra, selectLoanAccounts, selectLoanAccountsTotal, selectLoanDetailsAccountExtra, selectLoanDetailsAccounts, selectLoanDetailsAccountsTotal } from "@app/redux/accountManagement/slice";

function useFetchLoanAccountsDetails() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectLoanDetailsAccounts);
  const total = useAppSelector(selectLoanDetailsAccountsTotal)
  const extra = useAppSelector(selectLoanDetailsAccountExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, pscifuid, psaccnam }: useFetchLoanAccountsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchLoanDetailsAccounts({
        page: page || 0,
        limit: limit || 10,
        pscifuid: pscifuid || "",
        psaccnam: psaccnam || "",
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
  pscifuid?: string;
  psaccnam?: string; 
}

export default useFetchLoanAccountsDetails;