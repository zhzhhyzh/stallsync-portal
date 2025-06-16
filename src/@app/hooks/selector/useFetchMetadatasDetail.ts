import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import {
  fetchMetadataDetail,
  selectMetadata,
  setResetMetadatasDetail,
} from "@app/redux/metadata/slice";

function useFetchMetadatasDetail(id: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectMetadata);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) {
      if (
        id !== null &&
        id !== "undefined" 
      ) {
        onInit();
      }
    }
  }, [isLogined]);

  async function onInit() {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      fetchMetadataDetail({
        id
      })
    ); //fire api (call action)

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  }

  function reset() {
    dispatch(setResetMetadatasDetail());
  }

  return [data, onInit, loading, reset];
}

// interface useFetchMetadatasDetailProps {
//   id: string;
// }

export default useFetchMetadatasDetail;
