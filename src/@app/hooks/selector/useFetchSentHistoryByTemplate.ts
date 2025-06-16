import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchHistoriesByTemplate, selectSentHistoriesByTemplate, selectSentHistoriesByTemplateExtra, selectSentHistoriesByTemplateTotal } from "@app/redux/notificationSentHistory/slice";

function useFetchSentHistoriesByTemplate() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectSentHistoriesByTemplate);
  const total = useAppSelector(selectSentHistoriesByTemplateTotal)
  const extra = useAppSelector(selectSentHistoriesByTemplateExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, search }: useFetchSentHistoriesByTemplateProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchHistoriesByTemplate({
        page: page || 0,
        limit: limit || 10,
        search: search || "",
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchSentHistoriesByTemplateProps {
  page?: number;
  limit?: number;
  search?: string;
}

export default useFetchSentHistoriesByTemplate;