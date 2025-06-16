import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchActActList, selectactactExtra, selectActActs, selectActActTotal, setResetActActDetail } from "@app/redux/queue/slice";


function useFetchActActs({ page, limit, practcod, practncd }: useFetchActActProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectActActs);
  const total = useAppSelector(selectActActTotal)
  const extra = useAppSelector(selectactactExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && practcod !== "undefined") onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  function reset() {
    dispatch(setResetActActDetail());
  }

  async function onInit({ page, limit }: useFetchActActProps) {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchActActList({
        page: page || 0,
        limit: limit || 10,
        practcod: practcod,
        practncd: practncd,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
    // console.log("practcod", practcod);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchActActProps {
  page?: number;
  limit?: number;
  practcod?: string;
  practncd?: string;
}

export default useFetchActActs;
