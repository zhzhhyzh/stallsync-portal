import NotificationAdHocForm from "@app/components/forms/NotificationAdHoc/NotificationAdHocForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function NotificationAdHoc() {
  const router = useRouter();

  return (
    <>
      <NotificationAdHocForm />
    </>
  );
}
