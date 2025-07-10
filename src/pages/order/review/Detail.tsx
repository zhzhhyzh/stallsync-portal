import TransactionForm from "@app/components/forms/Transaction/TransactionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const ordDate = String(router.query?.ordDate);
  const ordId = String(router.query?.ordId);
  const mode = String(router.query?.mode);

  return (
    <>
      {
        id && id !== "undefined" ? (
          <TransactionForm id={id} ordDate={ordDate}  ordId={ordId} mode={mode} />
        ) : (
          mode && mode === "ADD" &&
          <TransactionForm id={null}  ordDate={ordDate}  ordId={ordId} mode={mode} />
        )}
    </>
  );
}
