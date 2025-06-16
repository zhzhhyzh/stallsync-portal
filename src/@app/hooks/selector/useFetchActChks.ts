import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchActChkList, selectactchkExtra, selectActChks, selectActChkTotal, setResetActChkDetail } from "@app/redux/queue/slice";


function useFetchActChks({ page, limit, practcod, prchklcod }: useFetchActChkProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectActChks);
  const total = useAppSelector(selectActChkTotal)
  const extra = useAppSelector(selectactchkExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  useEffect(() => {
    // here must check also
    if (isLogined && practcod !== "undefined") {
      onInit({});
    }
  }, [isLogined]);//check if login only call (for only authorized api)

  function reset() {
    dispatch(setResetActChkDetail());
  }

  async function onInit({ page, limit }: useFetchActChkProps) {
    setLoading(true);
    reset();
    console.log(practcod, "practcod here before payload")
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchActChkList({
        page: page || 0,
        limit: limit || 10,
        practcod: practcod,
        // prchklcod: prchklcod,

      })
    ); //fire api (call action)
    console.log(payload, 'this is payload')

    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
    // console.log(practcod, 'pppppppppppppppppppppppp')
    // console.log("Data......", data);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchActChkProps {
  page?: number;
  limit?: number;
  practcod?: string;
  prchklcod?: string;

}

export default useFetchActChks;
