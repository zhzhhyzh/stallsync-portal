import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { fetchDDLAvluser, logout, selectAvluser, selectIsLogined } from "@app/redux/app/slice";

function useFetchDDLAvlUser() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectAvluser);
  const isLogined = useAppSelector(selectIsLogined);
  const [loading, setLoading] = useState(false);

  // Load once on login
  useEffect(() => {
    if (isLogined) {
      reload(); // Initial load with no param
    }
  }, [isLogined]);

  // Reload function with dynamic param
  const reload = async (psstftyp?: string) => {
    setLoading(true);
    const { payload } = await dispatch(fetchDDLAvluser({ psstftyp }));
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
  };

  return [data, reload, loading] as const; // return as fixed tuple
}

export default useFetchDDLAvlUser;
