import TranCodeForm from "@app/components/forms/TranCode/TranCodeForm";
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
          <TranCodeForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <TranCodeForm id={null} mode={mode} />
      )}
    </>
  );
}
