import MbrProfileForm from "@app/components/forms/MbrProfile/MbrProfileForm";
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
          <MbrProfileForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <MbrProfileForm id={null} mode={mode} />
      )}
    </>
  );
}
