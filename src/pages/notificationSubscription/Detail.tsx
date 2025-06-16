import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

// import NotificationGroupDataForm from "@app/components/forms/NotificationGroupData/NotificationGroupDataForm";
import NotificationSubscriptionForm from "@app/components/forms/NotificationSubscription/NotificationSubscriptionForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <NotificationSubscriptionForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <NotificationSubscriptionForm id={null} mode={mode} />
      )}
    </>
  );
}