import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAccountCustomerRelationships, selectCustomerRelationshipExtra, selectCustomerRelationships, selectCustomerRelationshipTotal } from "@app/redux/accountManagement/slice";

function useFetchCustomerRelationships() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectCustomerRelationships);
  const total = useAppSelector(selectCustomerRelationshipTotal)
  const extra = useAppSelector(selectCustomerRelationshipExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, cifNo }: useFetchCustomerRelationshipsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAccountCustomerRelationships({
        page: page || 0,
        limit: limit || 10,
        cifNo: cifNo || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchCustomerRelationshipsProps {
  page?: number;
  limit?: number;
  cifNo?: string;
}

export default useFetchCustomerRelationships;