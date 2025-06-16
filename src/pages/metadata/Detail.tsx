import MetadatasForm from "@app/components/forms/Metadata/MetadataForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <MetadatasForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <MetadatasForm id={null} mode={mode} />
      )}
    </>
  );
}