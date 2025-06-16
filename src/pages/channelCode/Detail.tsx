import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import CommunicationChannelForm from "@app/components/forms/ChannelCode/CommunicationChannelForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);

  return (
    <>
      {id && id !== "undefined" ? (
        <CommunicationChannelForm id={id} mode={mode} />
      ) : (
        mode && mode === "ADD" &&
          <CommunicationChannelForm id={null} mode={mode} />
      )}
    </>
  );
}