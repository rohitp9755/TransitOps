import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-xl rounded-[1.5rem] border border-ink-700 bg-ink-900/98 shadow-[0_40px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="rounded-2xl p-2 text-slate-400 transition hover:bg-ink-800 hover:text-slate-100" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-col gap-3 border-t border-ink-700 px-6 py-5 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
