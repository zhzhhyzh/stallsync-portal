import WorkgroupForm from "@app/components/forms/Workgroup/WorkgroupForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <WorkgroupForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <WorkgroupForm id={null} mode={mode} />
      )}
    </>
  );
}
