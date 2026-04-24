import { AppLayout } from "@forge-ui/react";
import { menuItems, favoriteItems, profile } from "@/config/menu";

export default function DashboardPage() {
  return (
    <AppLayout
      mode="light"
      profilePosition="sidebar"
      accent="purple"
      teamName="Your Team"
      teamMemberCount={12}
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      notifications={5}
      messages={2}
      pageTitle="Dashboard"
      pageHeaderVariant="home"
      primaryAction={{ label: "New" }}
      secondaryAction={{ label: "Export" }}
    >
      <div className="flex flex-col gap-6">
        {/* Stat row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-xs font-medium tracking-fg text-fg-grey-500"
            >
              Stat {i}
            </div>
          ))}
        </div>

        {/* Main + side */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex h-80 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500 lg:col-span-2">
            Main chart
          </div>
          <div className="flex h-80 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500">
            Side widget
          </div>
        </div>

        {/* Two column row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500"
            >
              Section {i}
            </div>
          ))}
        </div>

        {/* Full-width bottom */}
        <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500">
          Table / list placeholder
        </div>
      </div>
    </AppLayout>
  );
}
