import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
// import { fetchWorkgroupList, selectExtra, selectWorkgroups, selectWorkgroupTotal } from "@app/redux/workgroup/slice";
import { fetchWorkgroupUserList, selectExtra, selectWorkgroupUsers, selectWorkgroupUsersTotal } from "@app/redux/workgroupuser/slice";

function useFetchWorkgroupUsers() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectWorkgroupUsers);
  const total = useAppSelector(selectWorkgroupUsersTotal)
  const extra = useAppSelector(selectExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    // if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit }: useFetchWorkgroupUsersProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchWorkgroupUserList({
        page: page || 0,
        limit: limit || 10,
        // prfuncde: functionCode || ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }

    setLoading(false);

  }
  return [data, onInit, total, extra, loading];
}

interface useFetchWorkgroupUsersProps {
  page?: number;
  limit?: number;
//   functionCode?: string; 
}

export default useFetchWorkgroupUsers;