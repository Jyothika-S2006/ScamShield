import { ShieldCheck, ShieldAlert } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft">
            <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-ink-900">
              Scam<span className="text-brand-600">Shield</span>
            </h1>
            <p className="text-xs font-medium text-ink-400">Family Scam Protection</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-ok-50 px-3 py-1.5 ring-1 ring-ok-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok-400 opacity-60"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok-500"></span>
          </span>
          <span className="text-sm font-semibold text-ok-700">Protected</span>
        </div>
      </div>
    </header>
  );
}

export function ProtectedBadgeFallback() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-warn-50 px-3 py-1.5 ring-1 ring-warn-200">
      <ShieldAlert className="h-4 w-4 text-warn-600" />
      <span className="text-sm font-semibold text-warn-700">Checking…</span>
    </div>
  );
}
