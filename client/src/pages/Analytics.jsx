import { api, getToken } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { currency } from '../lib/constants.js';
import { Card, Spinner, ErrorState, Button } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

const BASE = import.meta.env.VITE_API_URL ?? '';

export default function Analytics() {
  const { data, loading, error, refetch } = useFetch(() => api.get('/analytics').then((r) => r.data));

  // CSV lives behind auth; fetch as a blob so the bearer token is sent.
  async function exportCsv() {
    const res = await fetch(`${BASE}/api/analytics/export`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transitops-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { summary, monthlyRevenue, topCostliest } = data;
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((m) => m.revenue));
  const maxCost = Math.max(1, ...topCostliest.map((v) => v.operationalCost));

  const cards = [
    { label: 'Fuel Efficiency', value: `${summary.fuelEfficiency} km/l`, accent: 'border-l-status-available' },
    { label: 'Fleet Utilization', value: `${summary.fleetUtilization}%`, accent: 'border-l-status-ontrip' },
    { label: 'Operational Cost', value: `₹${currency(summary.operationalCost)}`, accent: 'border-l-status-inshop' },
    { label: 'Fleet ROI', value: `${summary.fleetRoi}%`, accent: 'border-l-primary' },
  ];

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="Efficiency, cost, and return on the fleet">
        <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className={`border-l-4 p-5 shadow-sm bg-[var(--surface)] ${c.accent}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{c.label}</p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">{c.value}</p>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--muted-foreground)]">ROI = (Revenue − (Maintenance + Fuel)) ÷ Acquisition Cost</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6 bg-[var(--surface)] shadow-sm">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Monthly Revenue</h2>
          {monthlyRevenue.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">No completed trips yet</p>
          ) : (
            <div className="flex h-48 items-end gap-3">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div className="w-full rounded-t bg-[var(--surface-muted)]" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}>
                      <div className="h-full rounded-t bg-status-ontrip/70 w-full" style={{ height: '100%' }} title={`₹${currency(m.revenue)}`} />
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)]">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[var(--surface)] shadow-sm">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Top Costliest Vehicles</h2>
          <div className="space-y-4">
            {topCostliest.map((v, i) => {
              const colors = ['bg-status-retired', 'bg-status-inshop', 'bg-status-ontrip', 'bg-slate-500', 'bg-slate-600'];
              return (
                <div key={v.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">{v.regNumber}</span>
                    <span className="text-[var(--muted-foreground)]">₹{currency(v.operationalCost)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div className={`h-full rounded-full ${colors[i]}`} style={{ width: `${(v.operationalCost / maxCost) * 100}%` }} />
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
