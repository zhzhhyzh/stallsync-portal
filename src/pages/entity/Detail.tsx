import EntityForm from "@app/components/forms/Entity/EntityForm";
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
          <EntityForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <EntityForm id={null} mode={mode} />
      )}
    </>
  );
}