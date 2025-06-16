import TaxCodeForm from "@app/components/forms/taxCode/TaxCodeForm";
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
          <TaxCodeForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <TaxCodeForm id={null} mode={mode} />
      )}
    </>
  );
}
