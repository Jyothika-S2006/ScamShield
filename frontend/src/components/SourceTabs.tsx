import { MessageSquare, Smartphone, Phone, Link as LinkIcon } from 'lucide-react';
import type { Source, SourceId } from '@/types';

const ICONS = {
  MessageSquare,
  Smartphone,
  Phone,
  Link: LinkIcon,
};

interface Props {
  sources: Source[];
  active: SourceId;
  onChange: (id: SourceId) => void;
}

export function SourceTabs({ sources, active, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {sources.map((s) => {
        const Icon = ICONS[s.icon];
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`group flex flex-col items-center gap-2 rounded-xl border px-3 py-3.5 text-center transition-all duration-200 ${
              isActive
                ? 'border-brand-500 bg-brand-50 shadow-soft'
                : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isActive ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500 group-hover:bg-ink-200'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span
              className={`text-xs font-semibold leading-tight ${
                isActive ? 'text-brand-700' : 'text-ink-600'
              }`}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
