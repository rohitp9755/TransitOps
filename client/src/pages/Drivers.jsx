import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Card, Field, Input, Select, Badge, Spinner, ErrorState, EmptyState } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Modal } from '../components/Modal.jsx';

const STATUSES = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'];
const EMPTY = { name: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', contact: '', safetyScore: 100, status: 'AVAILABLE' };

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' });
}

export default function Drivers() {
  const { can } = useAuth();
  const editable = can('drivers', 'edit');
  const [modalOpen, setModalOpen] = useState(false);
  const { data, loading, error, refetch } = useFetch(() => api.get('/drivers').then((r) => r.data));

  return (
    <>
      <PageHeader title="Drivers & Safety Profiles" subtitle="License compliance and availability">
        {editable && <Button onClick={() => setModalOpen(true)}>+ Add Driver</Button>}
      </PageHeader>

      <Card className="bg-ink-900/95 shadow-sm shadow-black/20">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data.length === 0 ? (
          <EmptyState title="No drivers yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  <th className="px-5 py-3 font-medium">Driver</th>
                  <th className="px-5 py-3 font-medium">License No.</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Expiry</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Safety</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id} className="border-t border-[var(--border)]/60 hover:bg-[var(--surface-muted)]">
                    <td className="px-5 py-4 font-medium text-[var(--foreground)]">{d.name}</td>
                    <td className="px-5 py-3 text-[var(--muted-foreground)]">{d.licenseNumber}</td>
                    <td className="px-5 py-3 text-[var(--muted-foreground)]">{d.licenseCategory}</td>
                    <td className="px-5 py-3">
                      <span className={d.licenseExpired ? 'font-medium text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}>
                        {fmtDate(d.licenseExpiry)}{d.licenseExpired && ' · Expired'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--muted-foreground)]">{d.contact}</td>
                    <td className="px-5 py-3 text-[var(--muted-foreground)]">{d.safetyScore}%</td>
                    <td className="px-5 py-3"><Badge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="mt-3 text-xs text-[var(--muted-foreground)]">
        Drivers with expired licenses or Suspended status are blocked from trip assignment.
      </p>

      {modalOpen && <DriverModal onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); refetch(); }} />}
    </>
  );
}

function DriverModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    setError('');
    try {
      await api.post('/drivers', { ...form, safetyScore: Number(form.safetyScore) });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Add Driver"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Driver'}</Button>
        </>
      }
    >
      {error && <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-3 py-2 text-sm text-status-retired">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><Input value={form.name} onChange={set('name')} placeholder="Alex" /></Field>
        <Field label="License Number"><Input value={form.licenseNumber} onChange={set('licenseNumber')} placeholder="DL-8823" /></Field>
        <Field label="Category">
          <Select value={form.licenseCategory} onChange={set('licenseCategory')}>
            {['LMV', 'HMV', 'MCWG'].map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="License Expiry"><Input type="date" value={form.licenseExpiry} onChange={set('licenseExpiry')} /></Field>
        <Field label="Contact"><Input value={form.contact} onChange={set('contact')} placeholder="9876500000" /></Field>
        <Field label="Safety Score"><Input type="number" min="0" max="100" value={form.safetyScore} onChange={set('safetyScore')} /></Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
