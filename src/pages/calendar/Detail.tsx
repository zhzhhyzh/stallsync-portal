import HolidayForm from "@app/components/forms/holiday/HolidayForm";
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
          <HolidayForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <HolidayForm id={null} mode={mode} />
      )}
    </>
  );
}
