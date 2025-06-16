import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { logout, } from "@app/redux/app/slice";
import { selectIsLogined } from "@app/redux/app/slice";
import { useRouter } from "next/router";
import { fetchActList, selectactivityExtra, selectactivitys, selectactivityTotal, setResetActivityDetail} from "@app/redux/queue/slice";


function useFetchActs({ page, limit, prquecde }: useFetchActProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const data = useAppSelector(selectactivitys);
  const total = useAppSelector(selectactivityTotal)
  const extra = useAppSelector(selectactivityExtra)
  const [loading, setLoading] = useState(false);
  const isLogined = useAppSelector(selectIsLogined);

  function reset(){
    dispatch(setResetActivityDetail());
  }
  useEffect(() => {
    // here must check also
    if (isLogined && prquecde !== "undefined") onInit({});
  }, [isLogined]);//check if login only call (for only authorized api)

  async function onInit({ page, limit }: useFetchActProps) {
    setLoading(true);
    reset();
    const { payload } = await dispatch(
      //first time call, will pass in page 0 to the api, default use 10 length,
      fetchActList({
        page: page || 0,
        limit: limit || 10,
        prquecde: prquecde,
        
      })
    ); //fire api (call action)
    if (payload?.code === "UNAUTHORIZED" || payload?.code === "MULTIPLELOGIN") {
      dispatch(logout());
    }
    setLoading(false);
    // console.log(prquecde, 'pppppppppppppppppppppppp')
    // console.log("Data......", data);
  }
  return [data, onInit, total, extra, loading];
}

interface useFetchActProps {
  page?: number;
  limit?: number;
  prquecde?: string;
}

export default useFetchActs;
