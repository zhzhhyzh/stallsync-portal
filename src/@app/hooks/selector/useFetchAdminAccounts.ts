import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAdminAccounts, selectAdminAccounts, selectAdminAccountsTotal, selectExtra } from "@app/redux/adminAccounts/slice";
import Search from "antd/es/transfer/search";

function useFetchAdminAccounts() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAdminAccounts);
  const total = useAppSelector(selectAdminAccountsTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search, status }: useFetchAdminAccountsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAdminAccounts({
        page: page || 0,
        limit: limit || 10,
        // psusrunm: userId || "",
        // psusrnam: userName || "",
        search: search || "",
        psusrsts: status || ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchAdminAccountsProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; 
}

export default useFetchAdminAccounts;