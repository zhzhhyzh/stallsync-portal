import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchAccountRelationships, selectAccountRelationships, selectAccountRelationshipsExtra, selectAccountRelationshipsTotal } from "@app/redux/accountManagement/slice";

function useFetchAccountRelationships() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAccountRelationships);
  const total = useAppSelector(selectAccountRelationshipsTotal)
  const extra = useAppSelector(selectAccountRelationshipsExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, accNo }: useFetchAccountRelationshipsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchAccountRelationships({
        page: page || 0,
        limit: limit || 10,
        accNo: accNo || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchAccountRelationshipsProps {
  page?: number;
  limit?: number;
  accNo?: string;
}

export default useFetchAccountRelationships;