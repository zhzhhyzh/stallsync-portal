import MerchantForm from "@app/components/forms/Merchant/MerchantForm";
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
          <MerchantForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <MerchantForm id={null} mode={mode} />
      )}
    </>
  );
}
