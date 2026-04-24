export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-stretch p-6 bg-white">
      {/* Left brand panel — Forge 紫渐变 + 几何装饰，零图片依赖 */}
      <div className="relative hidden h-auto w-[640px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-fg-violet via-violet-600 to-violet-900 lg:block">
        {/* 抽象几何装饰 */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute right-12 top-1/3 h-48 w-48 rounded-3xl border border-white/20 rotate-12" />
        <div className="pointer-events-none absolute bottom-24 right-24 h-32 w-32 rounded-2xl bg-white/5 backdrop-blur-md" />

        {/* 品牌信息 */}
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2.5 text-base font-semibold tracking-fg">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-fg-violet font-bold">
              F
            </span>
            Forge Starter
          </div>

          <div className="flex flex-col gap-4">
            <p className="max-w-sm font-display text-4xl font-bold leading-tight tracking-fg">
              开箱即用的 ToB 后台起点
            </p>
            <p className="max-w-sm text-base leading-relaxed text-white/80">
              登录/注册 + 空白后台壳 + AGENTS.md，一条 pnpm dev 就能跑。
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );
}
