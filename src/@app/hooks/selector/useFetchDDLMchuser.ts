import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchDDLMchuser, logout, selectMchuser, selectIsLogined } from "@app/redux/app/slice";

function useFetchMchuser() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectMchuser);
  const isLogined = useAppSelector(selectIsLogined);
  const [loading, setLoading] = useState(false);

  // Load once on login
  useEffect(() => {
    if (isLogined) {
      reload(); // Initial load with no param
    }
  }, [isLogined]);

  // Reload function with dynamic param
  const reload = async (psmrcuid?: string) => {
    setLoading(true);
    const { payload } = await dispatch(fetchDDLMchuser({ psmrcuid }));
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  };

  return [data, reload, loading] as const; // return as fixed tuple
}

export default useFetchMchuser;
