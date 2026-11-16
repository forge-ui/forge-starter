import { takeOverPage, type PageTakeover } from "@forge-ui-official/agent";

const FIELDS = "input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select, [role=combobox]";
const SUBMIT = /^(保存|创建|提交|确认|删除|确定)/;

const visible = (element: Element) => element.getClientRects().length > 0;
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));

function labelOf(field: Element) {
  const explicit = field.getAttribute("aria-label");
  if (explicit) return explicit;
  const label = (field as HTMLInputElement).labels?.[0]?.textContent?.trim();
  return label || (field as HTMLInputElement).placeholder || "";
}

// After the page has taken the fill, walk the pointer over what was filled and stop on the button the
// user has to press: the agent prepared the form, the user saves it.
async function showFilledForm(takeover: PageTakeover) {
  for (let wait = 0; wait < 6; wait++) await frame();
  const dialog = [...document.querySelectorAll("dialog[open], [role=dialog]")].filter(visible).at(-1);
  if (!dialog) return;
  const fields = [...dialog.querySelectorAll<HTMLElement>(FIELDS)].filter(field => visible(field) && ((field as HTMLInputElement).value || field.textContent?.trim()));
  for (const field of fields.slice(0, 4)) await takeover.point(field, `填写「${labelOf(field) || "表单"}」`);
  const submit = [...dialog.querySelectorAll<HTMLButtonElement>("button")].filter(button => visible(button) && SUBMIT.test(button.textContent?.trim() ?? "")).at(-1);
  if (submit) await takeover.point(submit, `已填好，请核对后点「${submit.textContent?.trim()}」`);
}

/**
 * Runs a page action (navigate, fill a form) with Forge Agent's takeover: a pointer, a frame and the
 * user's input held off, with 停止 to abort. The page is handed back once the form is ready to review.
 */
export async function withPageTakeover<T>(label: string, work: () => Promise<T>, { onStop, form = false }: { onStop: () => void; form?: boolean }): Promise<T> {
  const takeover = takeOverPage({ label, onStop });
  try {
    const value = await work();
    if (form) await showFilledForm(takeover);
    return value;
  } finally {
    takeover.end();
  }
}
