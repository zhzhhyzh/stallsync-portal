import TestReceiverForm from "@app/components/forms/TestReceiver/TestReceiverForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <TestReceiverForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <TestReceiverForm id={null} mode={mode} />
      )}
    </>
  );
}