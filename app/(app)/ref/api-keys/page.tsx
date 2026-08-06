"use client";

/**
 * API Keys — ShipAny Next settings/apikeys
 * Create once (show full key) · list masked · copy · revoke
 */

import { useMemo, useState } from "react";
import { CopyLinear, TrashBinTrashLinear } from "solar-icon-set";
import {
  Button,
  CellMuted,
  CellText,
  DataTable,
  StatusBadge,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "api-keys")!;

type ApiKeyRow = {
  id: string;
  title: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string;
  status: "active" | "revoked";
};

const initialKeys: ApiKeyRow[] = [
  {
    id: "k1",
    title: "Production",
    prefix: "sk_live_8f3a…",
    createdAt: "12 Jul 2026",
    lastUsedAt: "今天 09:12",
    status: "active",
  },
  {
    id: "k2",
    title: "CI / Staging",
    prefix: "sk_test_b91c…",
    createdAt: "01 Jun 2026",
    lastUsedAt: "昨天 18:40",
    status: "active",
  },
  {
    id: "k3",
    title: "Old integration",
    prefix: "sk_live_00de…",
    createdAt: "10 Jan 2026",
    lastUsedAt: "—",
    status: "revoked",
  },
];

export default function RefApiKeysPage() {
  const [keys, setKeys] = useState(initialKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const columns: ColumnDef<ApiKeyRow>[] = useMemo(
    () => [
      {
        key: "title",
        header: "Name",
        flex: true,
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <span className="text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="font-mono text-xs text-fg-grey-500">{row.prefix}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={row.status === "active" ? "Active" : "Revoked"}
            color={row.status === "active" ? "green" : "grey"}
          />
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        width: "w-32",
        render: (row) => <CellMuted>{row.createdAt}</CellMuted>,
      },
      {
        key: "lastUsedAt",
        header: "Last used",
        width: "w-32",
        render: (row) => <CellText>{row.lastUsedAt}</CellText>,
      },
      {
        key: "actions",
        header: "",
        width: "w-28",
        render: (row) =>
          row.status === "active" ? (
            <Button
              color="grey"
              variant="tertiary"
              size="sm"
              iconLeft={<TrashBinTrashLinear size={14} />}
              onClick={() =>
                setKeys((prev) =>
                  prev.map((k) =>
                    k.id === row.id ? { ...k, status: "revoked" as const } : k,
                  ),
                )
              }
            >
              吊销
            </Button>
          ) : (
            <span className="text-xs text-fg-grey-400">—</span>
          ),
      },
    ],
    [],
  );

  function handleCreate() {
    const title = name.trim() || "New key";
    const full = `sk_live_${Math.random().toString(36).slice(2, 10)}_${Math.random().toString(36).slice(2, 14)}`;
    const prefix = `${full.slice(0, 12)}…`;
    setKeys((prev) => [
      {
        id: `k${Date.now()}`,
        title,
        prefix,
        createdAt: "刚刚",
        lastUsedAt: "—",
        status: "active",
      },
      ...prev,
    ]);
    setRevealedKey(full);
    setName("");
    setCreateOpen(false);
    setCopied(false);
  }

  async function copyKey() {
    if (!revealedKey) return;
    try {
      await navigator.clipboard.writeText(revealedKey);
      setCopied(true);
    } catch {
      setCopied(true);
    }
  }

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-grey-600">
          创建后<strong>只显示一次</strong>完整密钥；列表仅前缀。对齐 ShipAny Next settings/apikeys。
        </p>
        <Button color={siteConfig.accent} onClick={() => setCreateOpen(true)}>
          创建 Key
        </Button>
      </div>

      {revealedKey ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-fg-black">请立即复制密钥</p>
          <p className="mt-1 text-xs text-fg-grey-600">
            关闭后无法再次查看完整值（示意）。
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="flex-1 rounded-xl bg-white px-3 py-2 font-mono text-sm text-fg-black outline outline-1 outline-fg-grey-200">
              {revealedKey}
            </code>
            <Button
              color={siteConfig.accent}
              size="sm"
              iconLeft={<CopyLinear size={14} />}
              onClick={copyKey}
            >
              {copied ? "已复制" : "复制"}
            </Button>
            <Button color="grey" variant="tertiary" size="sm" onClick={() => setRevealedKey(null)}>
              关闭
            </Button>
          </div>
        </div>
      ) : null}

      <DataTable<ApiKeyRow>
        color={siteConfig.accent}
        columns={columns}
        rows={keys}
        getRowKey={(row) => row.id}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="创建 API Key"
        width="w-[480px]"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <TextField
            color={siteConfig.accent}
            label="名称"
            value={name}
            onChange={setName}
            placeholder="e.g. Production"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
          <Button color="grey" variant="tertiary" onClick={() => setCreateOpen(false)}>
            取消
          </Button>
          <Button color={siteConfig.accent} onClick={handleCreate}>
            生成
          </Button>
        </div>
      </Modal>
    </RefChrome>
  );
}
