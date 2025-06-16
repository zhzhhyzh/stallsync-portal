import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchBackup, selectBackup, selectTotal } from "@app/redux/backup/slice";

function useFetchBackupDatabase() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectBackup);
  const total = useAppSelector(selectTotal)

  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);
  // const extra = useAppSelector(selectExtra)

  useEffect(() => {
    //onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit}: useFetchBackupDatabaseProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchBackup({
        page: page || 0,
        limit: limit || 10,

      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total,loading];
}

interface useFetchBackupDatabaseProps {
  page?: number;
  limit?: number;

}

export default useFetchBackupDatabase;