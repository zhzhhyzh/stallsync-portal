import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import NotificationGroupDataForm from "@app/components/forms/NotificationGroupData/NotificationGroupDataForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const psngpcde = String(router.query?.psngpcde);
  const psngpdsc = String(router.query?.psngpdsc);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <NotificationGroupDataForm psngpcde={psngpcde} id={id} psngpdsc={psngpdsc} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <NotificationGroupDataForm id={null} psngpcde={psngpcde} psngpdsc={psngpdsc} mode={mode} />
      )}
    </>
  );
}