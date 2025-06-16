import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchRecipients, selectSentHistoriesRecipients, selectSentHistoriesRecipientsExtra, selectSentHistoriesRecipientsTotal } from "@app/redux/notificationSentHistory/slice";

function useFetchPreviewRecipients() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectSentHistoriesRecipients);
  const total = useAppSelector(selectSentHistoriesRecipientsTotal)
  const extra = useAppSelector(selectSentHistoriesRecipientsExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, id }: useFetchPreviewRecipientsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchRecipients({
        page: page || 0,
        limit: limit || 10,
        id: id || ""
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchPreviewRecipientsProps {
  page?: number;
  limit?: number;
  id?: string;
}

export default useFetchPreviewRecipients;