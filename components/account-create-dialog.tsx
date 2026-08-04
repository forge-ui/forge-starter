"use client";

/** @deprecated Prefer AccountFormDialog — kept as thin alias for create-only call sites. */
import { AccountFormDialog } from "@/components/account-form-dialog";

export function AccountCreateDialog({
  open,
  onClose,
  goToDetail = true,
}: {
  open: boolean;
  onClose: () => void;
  goToDetail?: boolean;
}) {
  return (
    <AccountFormDialog
      open={open}
      onClose={onClose}
      goToDetailOnCreate={goToDetail}
    />
  );
}
