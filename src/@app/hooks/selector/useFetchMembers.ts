import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { getMemberList,selectExtra , selectMembers, selectMembersTotal } from "@app/redux/member/slice";

function useFetchMembers(props:any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectMembers);
  const total = useAppSelector(selectMembersTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    // if (isLogined) onInit({});
  }, [isLogined]);

  async function onInit({ page, limit }: useFetchMembersProps) {
    setLoading(true);
    let limitH = props.limit? props.limit: limit? limit: 10;
    const { payload } = await dispatch(
      getMemberList({
        page: page || 0,
        limit: limitH,
        ...props,
      })
    );

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchMembersProps {
  page?: number;
  limit?: number;
}

export default useFetchMembers;
