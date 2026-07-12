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
      {error && <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-4 py-2.5 text-sm text-status-retired">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-2">
        {editable && (
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-200">Log Service Record</h2>
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
              <p className="text-xs text-slate-500">Opening a record sets the vehicle to In Shop and hides it from dispatch. Closing it restores Available.</p>
            </div>
          </Card>
        )}

        <Card className={editable ? '' : 'lg:col-span-2'}>
          <div className="border-b border-ink-800 px-5 py-3"><h2 className="text-sm font-semibold text-slate-200">Service Log</h2></div>
          {logs.loading ? (
            <Spinner />
          ) : logs.error ? (
            <ErrorState message={logs.error} onRetry={logs.refetch} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-2.5 font-medium">Vehicle</th>
                    <th className="px-5 py-2.5 font-medium">Service</th>
                    <th className="px-5 py-2.5 font-medium">Cost</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    {editable && <th className="px-5 py-2.5" />}
                  </tr>
                </thead>
                <tbody>
                  {logs.data.length === 0 && <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-500">No records</td></tr>}
                  {logs.data.map((m) => (
                    <tr key={m.id} className="border-t border-ink-800/70">
                      <td className="px-5 py-3 font-medium text-slate-200">{m.vehicle?.regNumber}</td>
                      <td className="px-5 py-3 text-slate-400">{m.serviceType}</td>
                      <td className="px-5 py-3 text-slate-400">₹{currency(m.cost)}</td>
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
