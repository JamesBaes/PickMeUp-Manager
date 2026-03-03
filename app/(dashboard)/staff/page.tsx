import { getStaffDashboardData } from "@/lib/staff/dashboard";

export default async function StaffDashboardPage() {
  const dashboardData = await getStaffDashboardData();

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <h1 className="font-heading text-5xl text-slate-700">Incoming Orders</h1>

          <div className="flex items-center gap-3 flex-wrap">
            <PillButton label={dashboardData.dateLabel} />
            <PillButton label={dashboardData.statusLabel} />
            <PillButton label={dashboardData.searchPlaceholder} className="w-40 text-left" />
          </div>
        </div>

        <table className="w-full text-slate-600">
          <thead>
            <tr className="border-b border-dashboard-border">
              <th className="py-3 w-12"></th>
              <th className="py-3 text-left font-body font-semibold">Order Id</th>
              <th className="py-3 text-left font-body font-semibold">Created</th>
              <th className="py-3 text-left font-body font-semibold">Customer</th>
              <th className="py-3 text-left font-body font-semibold">Total</th>
              <th className="py-3 text-left font-body font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.incomingOrders.map((order, index) => (
              <tr key={`${order.id}-${index}`} className="border-b border-dashboard-border">
                <td className="py-3">
                  <span className="h-4 w-4 rounded-sm border border-slate-300 block" />
                </td>
                <td className="py-3 font-body">{order.id}</td>
                <td className="py-3 font-body">{order.created}</td>
                <td className="py-3 font-body">{order.customer}</td>
                <td className="py-3 font-body">{order.total}</td>
                <td className="py-3">
                  <div className="h-9 w-32 rounded-xl bg-dashboard-success-soft text-dashboard-success flex items-center justify-center px-4 font-body">
                    <span>{order.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button className="h-9 px-10 rounded-xl border border-dashboard-border text-slate-500 font-body">
            More...
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-72">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-heading text-5xl text-slate-700">Top Selling</h2>
            <PillButton label="7 Days" compact />
          </div>

          <ul className="space-y-2">
            {dashboardData.topSellingItems.map((item) => (
              <li key={item.rank} className="grid grid-cols-[2rem_12rem_4rem] text-slate-600 font-body">
                <span>{item.rank}</span>
                <span>{item.name}</span>
                <span>{item.sold}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <h2 className="font-heading text-5xl text-slate-700 leading-tight mb-4">Daily Accepted Orders</h2>
          <div
            className="h-44 w-44 rounded-full grid place-items-center"
            style={{
              background: `conic-gradient(var(--color-dashboard-ring) ${dashboardData.acceptedOrdersPercent}%, var(--color-dashboard-ring-track) 0)`,
            }}
          >
            <div className="h-30 w-30 rounded-full bg-dashboard-card grid place-items-center border border-dashboard-border font-heading text-xl text-slate-700">
              {dashboardData.acceptedOrdersPercent}%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PillButton({
  label,
  className = "",
  compact = false,
}: {
  label: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      className={`rounded-xl border border-dashboard-border bg-dashboard-card text-slate-400 font-body ${
        compact ? "h-8 px-4 text-sm" : "h-9 px-6 text-sm"
      } ${className}`}
    >
      {label}
    </button>
  );
}