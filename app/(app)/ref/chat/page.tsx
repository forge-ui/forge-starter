"use client";

/**
 * Chat — micellaneous-template/chat
 * https://www.forgeui.org/templates/micellaneous-template/chat
 */

import { useState } from "react";
import { PhoneCallingLinear, VideocameraRecordLinear } from "solar-icon-set";
import {
  Avatar,
  Button,
  ChatBubble,
  ChatInputBar,
  ContactItem,
  TextField,
} from "@forge-ui-official/core";
import { MagniferLinear } from "solar-icon-set";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "chat")!;

const contacts = [
  { id: "c1", name: "王敏", message: "表格间距再对一下", online: true, unread: 2, avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=wm" },
  { id: "c2", name: "设计协作组", message: "12 人在线", online: true, unread: 0, team: true, avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=team" },
  { id: "c3", name: "李哲", message: "对账单已上传", online: false, unread: 0, avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=lz" },
  { id: "c4", name: "陈思", message: "明天面试改到 15:00", online: true, unread: 1, avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=cs" },
];

export default function RefChatPage() {
  const [activeId, setActiveId] = useState("c1");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const active = contacts.find((c) => c.id === activeId) ?? contacts[0];
  const list = contacts.filter(
    (c) => !search.trim() || c.name.includes(search.trim()),
  );

  return (
    <RefChrome meta={meta}>
      <div className="grid min-h-[640px] grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="flex flex-col overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <div className="border-b border-fg-grey-200 p-3">
            <TextField
              color={siteConfig.accent}
              value={search}
              onChange={setSearch}
              placeholder="搜索联系人…"
              iconLeft={<MagniferLinear size={16} />}
            />
          </div>
          <div className="flex flex-col gap-0.5 p-2">
            {list.map((c) => (
              <button key={c.id} type="button" onClick={() => setActiveId(c.id)} className="text-left">
                <ContactItem
                  type={c.team ? "team" : "person"}
                  color={siteConfig.accent}
                  avatar={c.avatar}
                  name={c.name}
                  message={c.message}
                  online={c.online}
                  unreadCount={c.unread || undefined}
                  active={c.id === activeId}
                  time="09:35"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <div className="flex items-center justify-between gap-3 border-b border-fg-grey-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar src={active.avatar} size="md" />
              <div>
                <p className="text-sm font-semibold text-fg-black">{active.name}</p>
                <p className="text-xs font-medium text-fg-green">
                  {active.team ? "12 人在线" : active.online ? "在线" : "离线"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button color="grey" variant="tertiary" aria-label="语音">
                <PhoneCallingLinear size={18} />
              </Button>
              <Button color="grey" variant="tertiary" aria-label="视频">
                <VideocameraRecordLinear size={18} />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-fg-grey-50 p-5">
            <ChatBubble
              type="received"
              avatar={active.avatar}
              senderName={active.name}
              content="帮我看下客户列表的行高和筛选条是否和 Forge DataTable 一致？"
              time="09:30"
            />
            <ChatBubble
              type="sent"
              color={siteConfig.accent}
              content="可以，我对照 ecommerce/customers 和 starter /ref/list-table 一起看。"
              time="09:31"
            />
            <ChatBubble
              type="received"
              avatar={active.avatar}
              senderName={active.name}
              variant="file"
              fileName="Customer_Filter.png"
              fileSize="1.2 MB"
              time="09:32"
            />
            <ChatBubble
              type="sent"
              color={siteConfig.accent}
              content="收到，截图里筛选应是单行 ButtonGroup + 搜索。"
              time="09:33"
            />
          </div>

          <div className="border-t border-fg-grey-200 p-3">
            <ChatInputBar
              placeholder="输入消息…"
              value={draft}
              onChange={setDraft}
              onSend={() => setDraft("")}
              sendLabel="发送"
              showAttachment
            />
          </div>
        </div>
      </div>
    </RefChrome>
  );
}
