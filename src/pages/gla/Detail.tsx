import GlaForm from "@app/components/forms/gla/GlaForm";
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
          <GlaForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <GlaForm id={null} mode={mode} />
      )}
    </>
  );
}
