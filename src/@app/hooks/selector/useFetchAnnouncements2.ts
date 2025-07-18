import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectExtra2, list2, manage, detail, selectAnnouncements2, selectAnnouncement, selectTotal2 } from "@app/redux/announcement/slice";

function useFetchAnnouncements2(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAnnouncements2);
  const total2 = useAppSelector(selectTotal2)
  const extra2 = useAppSelector(selectExtra2)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit }: useFetchAnnouncements2Props) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      list2({
        page: page || 0,
        limit: limit || 10,
        ...props
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total2, extra2, loading];
}

interface useFetchAnnouncements2Props {
  page?: number;
  limit?: number;

}

export default useFetchAnnouncements2;
