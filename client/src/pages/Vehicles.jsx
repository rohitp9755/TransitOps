import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { currency } from '../lib/constants.js';
import { Button, Card, Field, Input, Select, Badge, Spinner, ErrorState, EmptyState } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Modal } from '../components/Modal.jsx';

const STATUSES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];
const EMPTY = { regNumber: '', name: '', type: 'Van', maxLoadKg: '', odometer: '', acquisitionCost: '', region: '', status: 'AVAILABLE' };

export default function Vehicles() {
  const { can } = useAuth();
  const editable = can('fleet', 'edit');
  const [filters, setFilters] = useState({ search: '', type: '', status: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
  const { data, loading, error, refetch } = useFetch(
    () => api.get(`/vehicles${query ? `?${query}` : ''}`).then((r) => r.data),
    [query],
  );

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(vehicle) {
    setEditing(vehicle);
    setModalOpen(true);
  }

  return (
    <>
      <PageHeader title="Vehicle Registry" subtitle="Master list of fleet assets">
        {editable && <Button onClick={openAdd}>+ Add Vehicle</Button>}
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search reg no. or name…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="max-w-xs"
        />
        <Select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
          <option value="">Type: All</option>
          {['Van', 'Truck', 'MPV'].map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">Status: All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </Select>
      </div>

      <Card>
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data.length === 0 ? (
          <EmptyState title="No vehicles found" hint="Try clearing filters or add a vehicle." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Reg No.</th>
                  <th className="px-5 py-3 font-medium">Name / Model</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Capacity</th>
                  <th className="px-5 py-3 font-medium">Odometer</th>
                  <th className="px-5 py-3 font-medium">Acq. Cost</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  {editable && <th className="px-5 py-3" />}
                </tr>
              </thead>
              <tbody>
                {data.map((v) => (
                  <tr key={v.id} className="border-t border-ink-800/70 hover:bg-ink-850/40">
                    <td className="px-5 py-3 font-medium text-slate-200">{v.regNumber}</td>
                    <td className="px-5 py-3 text-slate-300">{v.name}</td>
                    <td className="px-5 py-3 text-slate-400">{v.type}</td>
                    <td className="px-5 py-3 text-slate-400">{currency(v.maxLoadKg)} kg</td>
                    <td className="px-5 py-3 text-slate-400">{currency(v.odometer)}</td>
                    <td className="px-5 py-3 text-slate-400">₹{currency(v.acquisitionCost)}</td>
                    <td className="px-5 py-3"><Badge status={v.status} /></td>
                    {editable && (
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openEdit(v)} className="text-xs font-medium text-primary hover:underline">
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="mt-3 text-xs text-primary/80">
        Registration numbers are unique · Retired and In-Shop vehicles are hidden from trip dispatch.
      </p>

      {modalOpen && (
        <VehicleModal
          vehicle={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); refetch(); }}
        />
      )}
    </>
  );
}

function VehicleModal({ vehicle, onClose, onSaved }) {
  const isEdit = Boolean(vehicle);
  const [form, setForm] = useState(vehicle ? { ...EMPTY, ...vehicle } : EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        type: form.type,
        maxLoadKg: form.maxLoadKg,
        odometer: form.odometer || 0,
        acquisitionCost: form.acquisitionCost || 0,
        region: form.region || undefined,
        status: form.status,
      };
      if (isEdit) {
        await api.patch(`/vehicles/${vehicle.id}`, payload);
      } else {
        await api.post('/vehicles', { ...payload, regNumber: form.regNumber });
      }
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
      title={isEdit ? `Edit ${vehicle.regNumber}` : 'Add Vehicle'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Vehicle'}</Button>
        </>
      }
    >
      {error && <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-3 py-2 text-sm text-status-retired">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Reg Number">
          <Input value={form.regNumber} onChange={set('regNumber')} disabled={isEdit} placeholder="GJ01AB1452" />
        </Field>
        <Field label="Name / Model">
          <Input value={form.name} onChange={set('name')} placeholder="VAN-05" />
        </Field>
        <Field label="Type">
          <Select value={form.type} onChange={set('type')}>
            {['Van', 'Truck', 'MPV', 'Other'].map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Max Load (kg)">
          <Input type="number" value={form.maxLoadKg} onChange={set('maxLoadKg')} placeholder="500" />
        </Field>
        <Field label="Odometer">
          <Input type="number" value={form.odometer} onChange={set('odometer')} placeholder="74000" />
        </Field>
        <Field label="Acquisition Cost (₹)">
          <Input type="number" value={form.acquisitionCost} onChange={set('acquisitionCost')} placeholder="620000" />
        </Field>
        <Field label="Region">
          <Input value={form.region ?? ''} onChange={set('region')} placeholder="West" />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
