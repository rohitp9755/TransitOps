import { useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Card, Field, Input, Select, Badge, Spinner, ErrorState } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Modal } from '../components/Modal.jsx';

const LIFECYCLE = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED'];
const EMPTY = { source: '', destination: '', vehicleId: '', driverId: '', cargoWeightKg: '', plannedDistanceKm: '', revenue: '' };

export default function Trips() {
  const { can } = useAuth();
  const editable = can('trips', 'edit');

  const board = useFetch(() => api.get('/trips').then((r) => r.data));
  const options = useFetch(
    () => (editable ? api.get('/trips/options').then((r) => r.data) : Promise.resolve({ vehicles: [], drivers: [] })),
    [editable],
  );

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [completing, setCompleting] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectedVehicle = useMemo(
    () => options.data?.vehicles.find((v) => v.id === form.vehicleId),
    [options.data, form.vehicleId],
  );

  // Live capacity check drives the inline validation panel and disables dispatch.
  const cargo = Number(form.cargoWeightKg) || 0;
  const capacity = selectedVehicle?.maxLoadKg ?? 0;
  const overCapacity = selectedVehicle && cargo > capacity;
  const canSubmit =
    form.source && form.destination && form.vehicleId && form.driverId && cargo > 0 && Number(form.plannedDistanceKm) > 0 && !overCapacity;

  async function refresh() {
    await Promise.all([board.refetch(), options.refetch()]);
  }

  // Create a draft, then immediately dispatch it (the mockup's primary action).
  async function createAndDispatch() {
    setBusy(true);
    setError('');
    try {
      const { data: trip } = await api.post('/trips', {
        ...form,
        cargoWeightKg: Number(form.cargoWeightKg),
        plannedDistanceKm: Number(form.plannedDistanceKm),
        revenue: Number(form.revenue) || 0,
      });
      await api.post(`/trips/${trip.id}/dispatch`);
      setForm(EMPTY);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function act(tripId, action) {
    setError('');
    try {
      await api.post(`/trips/${tripId}/${action}`);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader title="Trip Dispatcher" subtitle="Create, validate, and track trips end to end" />

      {error && (
        <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-4 py-2.5 text-sm text-status-retired">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Create trip */}
        {editable && (
          <Card className="p-5">
            <Stepper current="DRAFT" />
            <h2 className="mb-4 mt-5 text-sm font-semibold text-slate-200">Create Trip</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Source"><Input value={form.source} onChange={set('source')} placeholder="Gandhinagar Depot" /></Field>
                <Field label="Destination"><Input value={form.destination} onChange={set('destination')} placeholder="Ahmedabad Hub" /></Field>
              </div>
              <Field label="Vehicle (available only)">
                <Select value={form.vehicleId} onChange={set('vehicleId')}>
                  <option value="">Select a vehicle…</option>
                  {options.data?.vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.regNumber} — {v.maxLoadKg} kg capacity</option>
                  ))}
                </Select>
              </Field>
              <Field label="Driver (available only)">
                <Select value={form.driverId} onChange={set('driverId')}>
                  <option value="">Select a driver…</option>
                  {options.data?.drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Cargo (kg)"><Input type="number" value={form.cargoWeightKg} onChange={set('cargoWeightKg')} placeholder="450" /></Field>
                <Field label="Distance (km)"><Input type="number" value={form.plannedDistanceKm} onChange={set('plannedDistanceKm')} placeholder="60" /></Field>
                <Field label="Revenue (₹)"><Input type="number" value={form.revenue} onChange={set('revenue')} placeholder="9000" /></Field>
              </div>

              {/* Live validation panel */}
              {selectedVehicle && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${overCapacity ? 'border-status-retired/40 bg-status-retired/10' : 'border-status-available/40 bg-status-available/10'}`}>
                  <p className="text-slate-300">Vehicle capacity: <span className="font-semibold">{capacity} kg</span></p>
                  <p className="text-slate-300">Cargo weight: <span className="font-semibold">{cargo} kg</span></p>
                  <p className={`mt-1 font-medium ${overCapacity ? 'text-status-retired' : 'text-status-available'}`}>
                    {overCapacity
                      ? `✕ Capacity exceeded by ${cargo - capacity} kg — dispatch blocked`
                      : '✓ Within capacity — ready to dispatch'}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={createAndDispatch} disabled={!canSubmit || busy} className="flex-1">
                  {busy ? 'Dispatching…' : 'Dispatch'}
                </Button>
                <Button variant="secondary" onClick={() => setForm(EMPTY)} disabled={busy}>Clear</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Live board */}
        <Card className={`p-5 ${editable ? '' : 'lg:col-span-2'}`}>
          <h2 className="mb-4 text-sm font-semibold text-slate-200">Live Board</h2>
          {board.loading ? (
            <Spinner />
          ) : board.error ? (
            <ErrorState message={board.error} onRetry={board.refetch} />
          ) : board.data.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No trips yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {board.data.map((t) => (
                <div key={t.id} className="rounded-lg border border-ink-800 bg-ink-850/40 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{t.code}</p>
                      <p className="text-xs text-slate-400">{t.source} → {t.destination}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{t.vehicle?.regNumber ?? '—'} / {t.driver?.name ?? '—'}</p>
                      <p>{t.cargoWeightKg} kg · {t.plannedDistanceKm} km</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge status={t.status} />
                    {editable && (
                      <div className="flex gap-2">
                        {t.status === 'DRAFT' && <Button className="px-3 py-1 text-xs" onClick={() => act(t.id, 'dispatch')}>Dispatch</Button>}
                        {t.status === 'DISPATCHED' && (
                          <>
                            <Button variant="secondary" className="px-3 py-1 text-xs" onClick={() => setCompleting(t)}>Complete</Button>
                            <Button variant="danger" className="px-3 py-1 text-xs" onClick={() => act(t.id, 'cancel')}>Cancel</Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {completing && (
        <CompleteModal
          trip={completing}
          onClose={() => setCompleting(null)}
          onDone={() => { setCompleting(null); refresh(); }}
        />
      )}
    </>
  );
}

function Stepper({ current }) {
  const idx = LIFECYCLE.indexOf(current);
  return (
    <div className="flex items-center gap-2">
      {LIFECYCLE.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${i <= idx ? 'bg-primary' : 'bg-ink-700'}`} />
          <span className={`text-xs ${i <= idx ? 'text-slate-300' : 'text-slate-600'}`}>{step[0] + step.slice(1).toLowerCase()}</span>
          {i < LIFECYCLE.length - 1 && <span className="h-px w-5 bg-ink-700" />}
        </div>
      ))}
    </div>
  );
}

function CompleteModal({ trip, onClose, onDone }) {
  const [endOdometer, setEndOdometer] = useState('');
  const [fuelConsumedL, setFuel] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await api.post(`/trips/${trip.id}/complete`, {
        endOdometer: Number(endOdometer),
        fuelConsumedL: Number(fuelConsumedL),
      });
      onDone();
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
      title={`Complete ${trip.code}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving || !endOdometer || !fuelConsumedL}>
            {saving ? 'Completing…' : 'Complete Trip'}
          </Button>
        </>
      }
    >
      {error && <div className="mb-4 rounded-lg border border-status-retired/40 bg-status-retired/10 px-3 py-2 text-sm text-status-retired">{error}</div>}
      <p className="mb-4 text-sm text-slate-400">Enter the final odometer and fuel consumed. Vehicle and driver return to Available automatically.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Final Odometer"><Input type="number" value={endOdometer} onChange={(e) => setEndOdometer(e.target.value)} placeholder="74260" /></Field>
        <Field label="Fuel Consumed (L)"><Input type="number" value={fuelConsumedL} onChange={(e) => setFuel(e.target.value)} placeholder="31" /></Field>
      </div>
    </Modal>
  );
}
