import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchScheduleRecipients, selectScheduleRecipients, selectScheduleRecipientsExtra, selectScheduleRecipientsTotal } from "@app/redux/notificationsheduledetail/slice";

function useFetchPreviewScheduleRecipients() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectScheduleRecipients);
  const total = useAppSelector(selectScheduleRecipientsTotal)
  const extra = useAppSelector(selectScheduleRecipientsExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined) onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit, id }: useFetchPreviewScheduleRecipientsProps) {
    setLoading(true);
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchScheduleRecipients({
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

interface useFetchPreviewScheduleRecipientsProps {
  page?: number;
  limit?: number;
  id?: string;
}

export default useFetchPreviewScheduleRecipients;