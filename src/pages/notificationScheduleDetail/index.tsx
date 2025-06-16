import NotificationScheduleDetailForm from "@app/components/forms/NotificationScheduleDetail/NotificationScheduleDetailForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function NotificationScheduleDetail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const id2 = String(router.query?.id2);
  const desc = String(router.query?.desc);

  return (
    <>
      {id && id !== "undefined" && (
        <NotificationScheduleDetailForm id={id} id2={id2} desc={desc} />
      ) }
    </>
  );
}
