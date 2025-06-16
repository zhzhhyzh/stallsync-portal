import DealDateForm from "@app/components/forms/DealDate/DealDateForm";
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
          <DealDateForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <DealDateForm id={null} mode={mode} />
      )}
    </>
  );
}
