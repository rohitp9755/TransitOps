import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { currency } from '../lib/constants.js';
import { Button, Card, Field, Input, Select, Badge, Spinner, ErrorState } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

export default function Maintenance() {
  const { can } = useAuth();
  const editable = can('maintenance', 'edit');
  const logs = useFetch(() => api.get('/maintenance').then((r) => r.data));
  const vehicles = useFetch(() => (editable ? api.get('/vehicles').then((r) => r.data) : Promise.resolve([])), [editable]);

  const [form, setForm] = useState({ vehicleId: '', serviceType: '', cost: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Only vehicles that can actually enter the shop (not on a trip / retired).
  const serviceable = vehicles.data?.filter((v) => v.status === 'AVAILABLE' || v.status === 'IN_SHOP') ?? [];

  async function save() {
    setBusy(true);
    setError('');
    try {
      await api.post('/maintenance', { ...form, cost: Number(form.cost) || 0 });
      setForm({ vehicleId: '', serviceType: '', cost: '' });
      await Promise.all([logs.refetch(), vehicles.refetch()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function close(id) {
    setError('');
    try {
      await api.post(`/maintenance/${id}/close`);
      await Promise.all([logs.refetch(), vehicles.refetch()]);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader title="Maintenance" subtitle="Service records and shop status" />
      {error && <div className="mb-4 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-2.5 text-sm text-[var(--destructive)]">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-2">
        {editable && (
          <Card className="p-6 bg-[var(--surface)] shadow-sm">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Log Service Record</h2>
            <div className="space-y-4">
              <Field label="Vehicle">
                <Select value={form.vehicleId} onChange={set('vehicleId')}>
                  <option value="">Select a vehicle…</option>
                  {serviceable.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.status.replace('_', ' ')}</option>)}
                </Select>
              </Field>
              <Field label="Service Type"><Input value={form.serviceType} onChange={set('serviceType')} placeholder="Oil Change" /></Field>
              <Field label="Cost (₹)"><Input type="number" value={form.cost} onChange={set('cost')} placeholder="2500" /></Field>
              <Button onClick={save} disabled={busy || !form.vehicleId || !form.serviceType} className="w-full">
                {busy ? 'Saving…' : 'Save & Send to Shop'}
              </Button>
              <p className="text-xs text-[var(--muted-foreground)]">Opening a record sets the vehicle to In Shop and hides it from dispatch. Closing it restores Available.</p>
            </div>
          </Card>
        )}

        <Card className={`${editable ? '' : 'lg:col-span-2'} bg-[var(--surface)] shadow-sm`}>
          <div className="border-b border-[var(--border)] px-5 py-4 bg-[var(--surface-muted)]"><h2 className="text-sm font-semibold text-[var(--foreground)]">Service Log</h2></div>
          {logs.loading ? (
            <Spinner />
          ) : logs.error ? (
            <ErrorState message={logs.error} onRetry={logs.refetch} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                    <th className="px-5 py-2.5 font-medium">Vehicle</th>
                    <th className="px-5 py-2.5 font-medium">Service</th>
                    <th className="px-5 py-2.5 font-medium">Cost</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    {editable && <th className="px-5 py-2.5" />}
                  </tr>
                </thead>
                <tbody>
                  {logs.data.length === 0 && <tr><td colSpan={5} className="px-5 py-6 text-center text-[var(--muted-foreground)]">No records</td></tr>}
                  {logs.data.map((m) => (
                    <tr key={m.id} className="border-t border-[var(--border)]/60 hover:bg-[var(--surface-muted)]">
                      <td className="px-5 py-3 font-medium text-[var(--foreground)]">{m.vehicle?.regNumber}</td>
                      <td className="px-5 py-3 text-[var(--muted-foreground)]">{m.serviceType}</td>
                      <td className="px-5 py-3 text-[var(--muted-foreground)]">₹{currency(m.cost)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${m.status === 'ACTIVE' ? 'bg-status-inshop/15 text-status-inshop' : 'bg-status-available/15 text-status-available'}`}>
                          {m.status === 'ACTIVE' ? 'In Shop' : 'Completed'}
                        </span>
                      </td>
                      {editable && (
                        <td className="px-5 py-3 text-right">
                          {m.status === 'ACTIVE' && (
                            <button onClick={() => close(m.id)} className="text-xs font-medium text-primary hover:underline">Close</button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
