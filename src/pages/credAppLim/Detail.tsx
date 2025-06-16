import CrepAppLimForm from "@app/components/forms/CredAppLim/CrepAppLimForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {
        id && id !== "undefined" ? (
          <CrepAppLimForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <CrepAppLimForm id={null} mode={mode} />
      )}
    </>
  );
}
