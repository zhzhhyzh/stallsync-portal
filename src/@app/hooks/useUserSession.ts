import { useState, useEffect } from "react";

import { restoreUserSession, selectIsLogined, } from "@app/redux/app/slice";
import { useAppDispatch, useAppSelector } from "./useRedux";

function useUserSession() {
    const dispatch = useAppDispatch()

    const isLogined = useAppSelector(selectIsLogined)

    useEffect(() => {
        if (!isLogined) {
            onCheck()
        }
    }, [isLogined])

    async function onCheck() {
        const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN")
        if (AUTH_TOKEN) {
            dispatch(restoreUserSession())
        }
    }

    return isLogined
}

export default useUserSession