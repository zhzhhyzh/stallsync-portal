import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchredemptions, selectExtra, selectredemptions, selectTotal } from "@app/redux/reward/slice";

function useFetchRewardRedemptions(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectredemptions);
  const total = useAppSelector(selectTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);

  async function onInit({ page, limit }: useFetchRewardRedemptionsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      fetchredemptions({
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

interface useFetchRewardRedemptionsProps {
  page?: number;
  limit?: number;
}

export default useFetchRewardRedemptions;