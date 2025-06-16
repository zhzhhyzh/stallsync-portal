import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { detail, selectAnnouncement } from "@app/redux/announcement/slice";

function useFetchAnnouncementDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectAnnouncement);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined && id && id !== null && id !== "undefined") onInit();
    console.log("ID?!?!?!?! ", id)
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    const { payload } = await dispatch(
        detail({
        id,
      })); //fire api (call action)
      
      console.log("PAYLOAD=>", payload);

    if (payload?.code === "UNAUTHORIZED") {
      dispatch(logout());
    }
    setLoading(false);
  }
  return { data, loading, refetch: onInit };

}

export default useFetchAnnouncementDetail;
