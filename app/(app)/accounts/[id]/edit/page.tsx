"use client";

import { use } from "react";
import { AccountForm } from "@/components/account-form";

export default function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <AccountForm mode="edit" accountId={id} />;
}
