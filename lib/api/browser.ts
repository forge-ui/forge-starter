const FETCH_TIMEOUT_MS = 15000;

function nativeFetch(): typeof fetch {
  if (typeof window !== "undefined" && typeof window.fetch === "function") {
    return window.fetch.bind(window);
  }
  return fetch;
}

/** Client fetch that cannot spin forever (timeout + no Next cache). */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  init.signal?.addEventListener("abort", onAbort);
  try {
    return await nativeFetch()(input, {
      ...init,
      cache: "no-store",
      credentials: "include",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
    init.signal?.removeEventListener("abort", onAbort);
  }
}

export async function parseApiJson<T extends Record<string, unknown>>(res: Response): Promise<T & { ok: boolean; error?: string }> {
  const text = await res.text();
  if (!text) {
    return { ok: false, error: res.ok ? "响应为空" : `请求失败（${res.status}）` } as T & {
      ok: boolean;
      error?: string;
    };
  }
  try {
    return JSON.parse(text) as T & { ok: boolean; error?: string };
  } catch {
    return { ok: false, error: "响应无法解析" } as T & { ok: boolean; error?: string };
  }
}
