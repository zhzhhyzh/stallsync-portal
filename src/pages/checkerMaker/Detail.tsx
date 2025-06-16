import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import CheckerMakerForm from "@app/components/forms/CheckerMaker/CheckerMakerForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <CheckerMakerForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <CheckerMakerForm id={null} mode={mode} />
      )}
    </>
  );
}
