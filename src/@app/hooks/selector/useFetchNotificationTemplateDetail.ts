import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchNotificationTemplateDetail, selectNotificationTemplate, setResetNotificationTemplateDetail } from "@app/redux/notificationtemplate/slice";

function useFetchNotificationTemplateDetail(id: string, id2: string, language: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectNotificationTemplate);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined"){ 
      onInit();
    }
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchNotificationTemplateDetail({
        psnotcde: id,
        psnotchn: id2,
        psmsglng: language,
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset(){
    dispatch(setResetNotificationTemplateDetail());
  }

  return [data, onInit, loading, reset];
}

export default useFetchNotificationTemplateDetail;