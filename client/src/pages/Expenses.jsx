import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { currency } from '../lib/constants.js';
import { Button, Card, Field, Input, Select, Spinner, ErrorState } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Modal } from '../components/Modal.jsx';

export default function Expenses() {
  const { can } = useAuth();
  const editable = can('expenses', 'edit');
  const fuel = useFetch(() => api.get('/expenses/fuel').then((r) => r.data));
  const expenses = useFetch(() => api.get('/expenses').then((r) => r.data));
  const summary = useFetch(() => api.get('/expenses/summary').then((r) => r.data));
  const vehicles = useFetch(() => (editable ? api.get('/vehicles').then((r) => r.data) : Promise.resolve([])), [editable]);

  const [modal, setModal] = useState(null); // 'fuel' | 'expense' | null

  function refreshAll() {
    fuel.refetch();
    expenses.refetch();
    summary.refetch();
  }

  return (
    <>
      <PageHeader title="Fuel & Expense Management" subtitle="Operational cost tracking">
        {editable && (
          <>
            <Button variant="secondary" onClick={() => setModal('fuel')}>+ Log Fuel</Button>
            <Button onClick={() => setModal('expense')}>+ Add Expense</Button>
          </>
        )}
      </PageHeader>

      <div className="space-y-4">
        <Card>
          <div className="border-b border-ink-800 px-5 py-3"><h2 className="text-sm font-semibold text-slate-200">Fuel Logs</h2></div>
          <SimpleTable
            state={fuel}
            columns={['Vehicle', 'Date', 'Litres', 'Cost']}
            row={(f) => [f.vehicle?.regNumber, new Date(f.date).toLocaleDateString('en-GB'), `${f.liters} L`, `₹${currency(f.cost)}`]}
          />
        </Card>

        <Card>
          <div className="border-b border-ink-800 px-5 py-3"><h2 className="text-sm font-semibold text-slate-200">Other Expenses (Toll / Misc)</h2></div>
          <SimpleTable
            state={expenses}
            columns={['Category', 'Vehicle', 'Trip', 'Amount']}
            row={(e) => [e.category, e.vehicle?.regNumber ?? '—', e.trip?.code ?? '—', `₹${currency(e.amount)}`]}
          />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Total Operational Cost</p>
              <p className="text-xs text-slate-500">Auto = Fuel + Maintenance across the fleet</p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {summary.loading ? '…' : `₹${currency(summary.data?.total)}`}
            </p>
          </div>
        </Card>
      </div>

      {modal === 'fuel' && (
        <FuelModal vehicles={vehicles.data ?? []} onClose={() => setModal(null)} onSaved={() => { setModal(null); refreshAll(); }} />
      )}
      {modal === 'expense' && (
        <ExpenseModal vehicles={vehicles.data ?? []} onClose={() => setModal(null)} onSaved={() => { setModal(null); refreshAll(); }} />
      )}
    </>
  );
}

function SimpleTable({ state, columns, row }) {
  if (state.loading) return <Spinner />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.refetch} />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            {columns.map((c) => <th key={c} className="px-5 py-2.5 font-medium">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {state.data.length === 0 && <tr><td colSpan={columns.length} className="px-5 py-6 text-center text-slate-500">No records</td></tr>}
          {state.data.map((item) => (
            <tr key={item.id} className="border-t border-ink-800/70">
              {row(item).map((cell, i) => (
                <td key={i} className={`px-5 py-3 ${i === 0 ? 'font-medium text-slate-200' : 'text-slate-400'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FuelModal({ vehicles, onClose, onSaved }) {
  const [form, setForm] = useState({ vehicleId: '', liters: '', cost: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    setError('');
    try {
      await api.post('/expenses/fuel', { ...form, liters: Number(form.liters), cost: Number(form.cost) });
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return (
    <Modal open onClose={onClose} title="Log Fuel"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={saving || !form.vehicleId}>{saving ? 'Saving…' : 'Save'}</Button></>}>
      {error && <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-3 py-2 text-sm text-status-retired">{error}</div>}
      <div className="space-y-4">
        <Field label="Vehicle">
          <Select value={form.vehicleId} onChange={set('vehicleId')}>
            <option value="">Select…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Litres"><Input type="number" value={form.liters} onChange={set('liters')} /></Field>
          <Field label="Cost (₹)"><Input type="number" value={form.cost} onChange={set('cost')} /></Field>
        </div>
      </div>
    </Modal>
  );
}

function ExpenseModal({ vehicles, onClose, onSaved }) {
  const [form, setForm] = useState({ category: 'TOLL', amount: '', vehicleId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    setError('');
    try {
      await api.post('/expenses', { ...form, amount: Number(form.amount), vehicleId: form.vehicleId || undefined });
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return (
    <Modal open onClose={onClose} title="Add Expense"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={saving || !form.amount}>{saving ? 'Saving…' : 'Save'}</Button></>}>
      {error && <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-3 py-2 text-sm text-status-retired">{error}</div>}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <Select value={form.category} onChange={set('category')}>
              <option value="TOLL">Toll</option>
              <option value="MISC">Misc</option>
            </Select>
          </Field>
          <Field label="Amount (₹)"><Input type="number" value={form.amount} onChange={set('amount')} /></Field>
        </div>
        <Field label="Vehicle (optional)">
          <Select value={form.vehicleId} onChange={set('vehicleId')}>
            <option value="">—</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
