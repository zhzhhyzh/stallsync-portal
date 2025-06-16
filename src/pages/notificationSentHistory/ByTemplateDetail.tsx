import HistoryByTemplateDetailForm from "@app/components/forms/NotificationSentHistoryDetail/HistoryByTemplateDetailForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const channel = String(router.query?.channel);
  const mode = String(router.query?.mode);
  const accountNo = String(router.query?.accountNo);
  const cifId = String(router.query?.cifId);
  const screenType = String(router.query?.screenType);
  const previousMode = String(router.query?.currentMode);

  return (
    <>
      {id && id !== "undefined" && (
        <HistoryByTemplateDetailForm
          id={id}
          channel={channel}
          mode={mode}
          accountNo={accountNo}
          cifId={cifId}
          screenType={screenType}
          previousMode={previousMode}
        />
      )}
    </>
  );
}
