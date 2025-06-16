import GeneralTypeForm from "@app/components/forms/GeneralParameter/GeneralTypeForm";
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
          <GeneralTypeForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <GeneralTypeForm id={null} mode={mode} />
      )}
    </>
  );
}