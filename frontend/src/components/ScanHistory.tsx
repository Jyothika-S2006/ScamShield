import { History, ShieldX, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ScanHistoryItem } from '@/types';

interface Props {
  items: ScanHistoryItem[];
  onClear: () => void;
}

const ICON = {
  block: { Icon: ShieldX, cls: 'text-danger-600 bg-danger-50' },
  verify: { Icon: ShieldAlert, cls: 'text-warn-600 bg-warn-50' },
  safe: { Icon: ShieldCheck, cls: 'text-ok-600 bg-ok-50' },
};

const SOURCE_LABEL: Record<string, string> = {
  sms: 'SMS',
  upi: 'UPI',
  voice: 'Call',
  link: 'Link',
};

export function ScanHistory({ items, onClear }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <History className="h-4 w-4 text-ink-400" />
          <h3 className="text-sm font-bold text-ink-700">Recent checks</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-ink-400 transition-colors hover:text-danger-600"
        >
          Clear history
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const { Icon, cls } = ICON[item.verdict];
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/50 px-3 py-2.5"
            >
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${cls}`}>
                <Icon className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-700">{item.text}</p>
                <p className="text-xs text-ink-400">
                  {SOURCE_LABEL[item.source]} · {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className="flex-shrink-0 text-sm font-bold tabular-nums text-ink-600">{item.risk_score}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
