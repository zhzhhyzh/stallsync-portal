import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { calculate, selectLoanInfo, setResetLoanInfo } from "@app/redux/loanCalculator/slice";

function useFetchLoanCalculator() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectLoanInfo);
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    if (isLogined) reset();
  }, [isLogined]);//check if login only call (for only authorized api)

  // async function onInit() {
  //   setLoading(true);
  //   reset();
  //   const { payload } = await dispatch(
  //     //first time call, will pass in page 0 to the api, default use 10 length,
  //     calculate({})
  //   ); //fire api (call action)

  //   if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
  //     dispatch(logout());
  //   }
  //   setLoading(false);
  // }

  function reset() {
    dispatch(setResetLoanInfo());
  }

  return [data, loading];
}

export default useFetchLoanCalculator;