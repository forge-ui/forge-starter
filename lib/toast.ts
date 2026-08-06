/**
 * Global toast bus — call from any client module without React context.
 *
 * @example
 * import { toast } from "@/lib/toast";
 * toast.success("保存成功");
 * toast.error("删除失败");
 * toast.info("请填写名称");
 */

export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
  duration: number;
};

type Listener = (items: ToastItem[]) => void;

const DEFAULT_DURATION = 2600;
const MAX_VISIBLE = 4;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  const snapshot = items.slice();
  listeners.forEach((listener) => listener(snapshot));
}

function remove(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return;
  items = next;
  emit();
}

function push(tone: ToastTone, message: string, duration = DEFAULT_DURATION) {
  const text = message.trim();
  if (!text) return;

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  items = [...items, { id, message: text, tone, duration }].slice(-MAX_VISIBLE);
  emit();

  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => {
        remove(id);
      }, duration),
    );
  }
}

export const toast = {
  success(message: string, duration?: number) {
    push("success", message, duration ?? DEFAULT_DURATION);
  },
  error(message: string, duration?: number) {
    push("error", message, duration ?? DEFAULT_DURATION);
  },
  info(message: string, duration?: number) {
    push("info", message, duration ?? DEFAULT_DURATION);
  },
  dismiss(id: string) {
    remove(id);
  },
  clear() {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    items = [];
    emit();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(items.slice());
    return () => {
      listeners.delete(listener);
    };
  },
};
