/**
 * `@openuidev/react-lang` 在开发环境会顺带挂上 Inspect 浮层。
 * 这个 PoC 只借用渲染器，不能让它盖住 Forge 的后台壳。
 * 必须在导入 react-lang 之前执行。
 */
const mounted = Symbol.for("openui.devtools.autoMount");
(globalThis as Record<symbol, unknown>)[mounted] = true;
