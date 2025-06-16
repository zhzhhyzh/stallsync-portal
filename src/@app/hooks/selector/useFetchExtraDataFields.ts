import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, selectExtraDataField, fetchExtraDataField } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";

function useFetchExtraDataFields({ type }: useFetchExtraDataFieldsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectExtraDataField);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isLogined) onInit();
  }, [isLogined]);

  async function onInit() {
      setLoading(true);
      const { payload } = await dispatch(fetchExtraDataField({type}));
      if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
        dispatch(logout());
      }
      setLoading(false);
  }

  return [data, onInit, loading];
}

interface useFetchExtraDataFieldsProps {
  type?: string;
}

export default useFetchExtraDataFields;
