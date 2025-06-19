import RewardForm from "@app/components/forms/Reward/RewardForm";
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
          <RewardForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <RewardForm id={null} mode={mode} />
      )}
    </>
  );
}
