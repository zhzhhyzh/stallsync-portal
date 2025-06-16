import ComparForm from "@app/components/forms/compar/ComparForm";
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
          <ComparForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <ComparForm id={null} mode={mode} />
      )}
    </>
  );
}
