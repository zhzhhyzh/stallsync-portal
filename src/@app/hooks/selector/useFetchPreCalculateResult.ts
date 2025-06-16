import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { selectLoanPreCalculateResult } from "@app/redux/accountManagement/slice";

function useFetchPreCalculateResult() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectLoanPreCalculateResult);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    //if (isLogined && id && id !== null && id !== "undefined") onInit();
  }, [isLogined]);

  return [data];
}

export default useFetchPreCalculateResult;