import { Zap } from 'lucide-react';
import type { DemoMessage, SourceId } from '@/types';

interface Props {
  demos: DemoMessage[];
  activeSource: SourceId;
  onPick: (demo: DemoMessage) => void;
}

export function DemoButtons({ demos, activeSource, onPick }: Props) {
  const filtered = demos.filter((d) => d.source === activeSource);

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5 text-warn-500" fill="currentColor" />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          Quick demo samples
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => onPick(d)}
            className="rounded-full border border-warn-200 bg-warn-50 px-3 py-1.5 text-xs font-semibold text-warn-800 transition-all hover:border-warn-300 hover:bg-warn-100 active:scale-95"
          >
            {d.label}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-ink-400">No demo samples for this source. Paste your own message below.</p>
        )}
      </div>
    </div>
  );
}
