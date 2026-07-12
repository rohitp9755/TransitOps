import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLE_LABELS } from '../lib/constants.js';
import { Button, Card, Field, Input, Spinner, ErrorState } from '../components/ui.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

const RBAC_COLUMNS = [
  ['fleet', 'Fleet'],
  ['drivers', 'Drivers'],
  ['trips', 'Trips'],
  ['expenses', 'Fuel/Exp.'],
  ['analytics', 'Analytics'],
];

function cell(perm) {
  if (!perm) return '—';
  if (perm.edit) return '✓';
  if (perm.view) return 'View';
  return '—';
}

export default function Settings() {
  const { can } = useAuth();
  const editable = can('settings', 'edit');
  const { data, loading, error, refetch } = useFetch(() => api.get('/settings').then((r) => r.data));

  const [general, setGeneral] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setGeneral(data.general);
  }, [data]);

  if (loading || !general) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const set = (key) => (e) => { setGeneral((g) => ({ ...g, [key]: e.target.value })); setSaved(false); };

  async function save() {
    setSaving(true);
    try {
      await api.patch('/settings', general);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings & RBAC" subtitle="Organization configuration and access control" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 bg-ink-900/95 shadow-sm shadow-black/20">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">General</h2>
          <div className="space-y-4">
            <Field label="Depot Name"><Input value={general.depotName} onChange={set('depotName')} disabled={!editable} /></Field>
            <Field label="Currency"><Input value={general.currency} onChange={set('currency')} disabled={!editable} /></Field>
            <Field label="Distance Unit"><Input value={general.distanceUnit} onChange={set('distanceUnit')} disabled={!editable} /></Field>
            {editable && (
              <div className="flex items-center gap-3">
                <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
                {saved && <span className="text-sm text-status-available">Saved</span>}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-ink-900/95 shadow-sm shadow-black/20">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Role-Based Access (RBAC)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">Role</th>
                  {RBAC_COLUMNS.map(([, label]) => <th key={label} className="px-2 py-2 text-center font-medium">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.rbac.map(({ role, permissions }) => (
                  <tr key={role} className="border-t border-ink-800/70">
                    <td className="py-2.5 pr-4 font-medium text-slate-200">{ROLE_LABELS[role]}</td>
                    {RBAC_COLUMNS.map(([mod]) => {
                      const val = cell(permissions[mod]);
                      return (
                        <td key={mod} className={`px-2 py-2.5 text-center ${val === '✓' ? 'font-semibold text-status-available' : val === 'View' ? 'text-status-ontrip' : 'text-slate-600'}`}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Access is enforced server-side on every request and mirrored in the UI.</p>
        </Card>
      </div>
    </>
  );
}
