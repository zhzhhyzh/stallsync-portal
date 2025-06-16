import CurratForm from "@app/components/forms/currencyRate/CurratForm";
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
          <CurratForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <CurratForm id={null} mode={mode} />
      )}
    </>
  );
}
