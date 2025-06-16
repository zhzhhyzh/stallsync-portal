import SegmentsForm from "@app/components/forms/Segment/SegmentForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <SegmentsForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <SegmentsForm id={null} mode={mode} />
      )}
    </>
  );
}