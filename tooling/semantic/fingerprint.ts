import { moduleSourceFingerprint } from "../../scripts/modules.mjs";

export function sourceFingerprint(root: string) {
  return moduleSourceFingerprint(root);
}
