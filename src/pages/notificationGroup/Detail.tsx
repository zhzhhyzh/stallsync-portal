import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import NotificationGroupForm from "@app/components/forms/NotificationGroup/NotificationGroupForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <NotificationGroupForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <NotificationGroupForm id={null} mode={mode} />
      )}
    </>
  );
}