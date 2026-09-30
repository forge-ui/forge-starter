/** Decode one JSON string field from a partial tool-call argument buffer. */
export function partialJsonString(partial: string, field: string): string | null {
  const key = `"${field}"`;
  let search = 0;
  while (search < partial.length) {
    const at = partial.indexOf(key, search);
    if (at < 0) return null;
    let index = at + key.length;
    while (index < partial.length && /\s/.test(partial[index] ?? "")) index += 1;
    if (partial[index] !== ":") {
      search = at + key.length;
      continue;
    }
    index += 1;
    while (index < partial.length && /\s/.test(partial[index] ?? "")) index += 1;
    if (partial[index] !== '"') return null;
    index += 1;
    let text = "";
    while (index < partial.length) {
      const character = partial[index] ?? "";
      if (character === '"') return text;
      if (character === "\\") {
        if (index + 1 >= partial.length) return text;
        const next = partial[index + 1] ?? "";
        if (next === "u") {
          if (index + 6 > partial.length) return text;
          const hex = partial.slice(index + 2, index + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) return text;
          text += String.fromCharCode(Number.parseInt(hex, 16));
          index += 6;
          continue;
        }
        const escaped: Record<string, string> = {
          n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "\\": "\\", '"': '"', "/": "/",
        };
        text += escaped[next] ?? next;
        index += 2;
        continue;
      }
      text += character;
      index += 1;
    }
    return text;
  }
  return null;
}

/** User-visible answer inside a streaming respond() call. Questions stay hidden. */
export function respondAnswerText(partial: string): string {
  if (partialJsonString(partial, "outcome") !== "answer") return "";
  return partialJsonString(partial, "text") ?? "";
}
