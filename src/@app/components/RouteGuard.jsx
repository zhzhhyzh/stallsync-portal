import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useUserSession from "@app/hooks/useUserSession";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  logout,
  selectHome,
  selectIsLogined,
  selectReferralSignUp,
  selectWalletAddress,
} from "@app/redux/app/slice";
import { clearDashboardData } from "@app/redux/dashboard/slice";
import useFetchUserProfile from "@app/hooks/selector/useFetchUserProfile";
import { checkAccessMatrixRedirect } from "@app/utils/access-matrix";

export function RouteGuard({ children, loginOnly = false }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useUserSession();
  //const walletAddress = useAppSelector(selectWalletAddress);
  const isLogined = useAppSelector(selectIsLogined);
  //const [profile] = useFetchUserProfile();
  const homeData = useAppSelector(selectHome);

  // useEffect(() => {
  // // on initial load - run auth check
  // authCheck(router.asPath);

  // // on route change start - hide page content by setting authorized to false
  // const hideContent = () => setAuthorized(false);
  // router.events.on("routeChangeStart", hideContent);

  // // on route change complete - run auth check
  // router.events.on("routeChangeComplete", authCheck);

  // // unsubscribe from events in useEffect return function
  // return () => {
  //   router.events.off("routeChangeStart", hideContent);
  //   router.events.off("routeChangeComplete", authCheck);
  // };

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (!walletAddress) {
  //     // dispatch(logout());
  //   }
  // }, []);

  useEffect(() => {
    if(router.pathname.includes("kyc") && !isLogined){
      router.replace('/')
    }
  }, [router]);

  useEffect(() => {
    if (homeData?.access) {
      checkAccessMatrixRedirect(router, homeData?.access);
    }

    if(router.pathname === "/" && isLogined && homeData?.chgpwd === false){
      router.replace('/dashboard')
    }
  }, [router, homeData])

  useEffect(() => {
    if (!isLogined) {
      dispatch(clearDashboardData());
      //dispatch(clearDefiData());
    }
  }, [isLogined]);

  useEffect(() => {
    authCheck();
  }, [isAuthenticated]);

  function authCheck() {
    if (!isAuthenticated && loginOnly) {
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    }
  }

  return (isAuthenticated || !loginOnly) && children;
}