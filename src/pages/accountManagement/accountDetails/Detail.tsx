

import AccountDetailForm from "@app/components/forms/AccountManagement/AccountDetailForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const cifId = String(router.query?.cifId);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <AccountDetailForm id={id} cifId={cifId} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <AccountDetailForm id={null} cifId={null} mode={mode} />
      )}
    </>
  );
}