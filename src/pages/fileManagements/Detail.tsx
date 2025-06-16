
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import FileManagementForm from "@app/components/forms/FileManagement/FileManagementForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  console.log("ID =>", id);
  console.log("MODE =>", mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <FileManagementForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <FileManagementForm id={null} mode={mode} />
      )}
    </>
  );
}