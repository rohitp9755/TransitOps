import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { STATUS_STYLES } from '../lib/constants.js';
import { Card, Spinner, ErrorState, Badge } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

const KPI_META = [
  { key: 'activeVehicles', label: 'Active Vehicles', accent: 'border-l-slate-500' },
  { key: 'availableVehicles', label: 'Available Vehicles', accent: 'border-l-status-available' },
  { key: 'vehiclesInMaintenance', label: 'In Maintenance', accent: 'border-l-status-inshop' },
  { key: 'activeTrips', label: 'Active Trips', accent: 'border-l-status-ontrip' },
  { key: 'pendingTrips', label: 'Pending Trips', accent: 'border-l-slate-500' },
  { key: 'driversOnDuty', label: 'Drivers On Duty', accent: 'border-l-status-available' },
  { key: 'fleetUtilization', label: 'Fleet Utilization', accent: 'border-l-primary', suffix: '%' },
];

const STATUS_BAR_ORDER = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

function KpiCard({ label, value, accent, suffix }) {
  return (
    <Card className={`border-l-4 p-4 ${accent}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">
        {value}
        {suffix}
      </p>
    </Card>
  );
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch(() => api.get('/dashboard').then((r) => r.data));

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { kpis, recentTrips, vehicleStatus } = data;
  const totalVehicles = Object.values(vehicleStatus).reduce((a, b) => a + b, 0) || 1;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Live operational overview" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {KPI_META.map((m) => (
          <KpiCard key={m.key} label={m.label} value={kpis[m.key]} accent={m.accent} suffix={m.suffix} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-ink-800 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-200">Recent Trips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-2.5 font-medium">Trip</th>
                  <th className="px-5 py-2.5 font-medium">Vehicle</th>
                  <th className="px-5 py-2.5 font-medium">Driver</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-slate-500">No trips yet</td></tr>
                )}
                {recentTrips.map((t) => (
                  <tr key={t.id} className="border-t border-ink-800/70">
                    <td className="px-5 py-3 font-medium text-slate-200">{t.code}</td>
                    <td className="px-5 py-3 text-slate-400">{t.vehicle}</td>
                    <td className="px-5 py-3 text-slate-400">{t.driver}</td>
                    <td className="px-5 py-3"><Badge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-200">Vehicle Status</h2>
          <div className="space-y-3">
            {STATUS_BAR_ORDER.map((status) => {
              const count = vehicleStatus[status] ?? 0;
              const pct = Math.round((count / totalVehicles) * 100);
              const s = STATUS_STYLES[status];
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{s.label}</span>
                    <span className="font-medium text-slate-300">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-800">
                    <div className={`h-full rounded-full ${s.bg}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
