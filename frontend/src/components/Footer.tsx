import { Phone, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <a
          href="tel:1930"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-danger-600 to-danger-700 p-4 text-white shadow-soft transition-transform hover:scale-[1.01] sm:p-5"
        >
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <Phone className="h-6 w-6" strokeWidth={2.4} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">Emergency Helpline</p>
            <p className="text-base font-bold sm:text-lg">Indian Cyber Crime Helpline · Call 1930</p>
            <p className="text-xs text-white/80">Tap to call. Report fraud, lost money, or suspicious activity.</p>
          </div>
          <span className="ml-auto hidden rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 sm:inline-block">
            24×7
          </span>
        </a>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-ink-100 py-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-semibold text-ink-700">ScamShield for Families</span>
          </div>
          <p className="text-xs text-ink-400">
            Helping Indian families stay safe from scams. Always verify before you act.
          </p>
        </div>
      </div>
    </footer>
  );
}
