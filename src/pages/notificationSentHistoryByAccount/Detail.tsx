import HistoryByAccountDetailForm from "@app/components/forms/NotificationSentHistoryDetail/HistoryByAccountDetailForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const channel = String(router.query?.channel);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" && (
        <HistoryByAccountDetailForm id={id} channel={channel} mode={mode} />
      )}
    </>
  );
}