import type { Verdict } from '@/types';

interface Props {
  score: number;
  verdict: Verdict;
}

const VERDICT_THEME = {
  block: {
    bar: 'bg-gradient-to-r from-danger-500 to-danger-600',
    track: 'bg-danger-100',
    text: 'text-danger-700',
    label: 'Block & Alert',
    icon: 'bg-danger-500',
  },
  verify: {
    bar: 'bg-gradient-to-r from-warn-400 to-warn-500',
    track: 'bg-warn-100',
    text: 'text-warn-700',
    label: 'Verify Carefully',
    icon: 'bg-warn-500',
  },
  safe: {
    bar: 'bg-gradient-to-r from-ok-400 to-ok-500',
    track: 'bg-ok-100',
    text: 'text-ok-700',
    label: 'Safe',
    icon: 'bg-ok-500',
  },
};

export function RiskGauge({ score, verdict }: Props) {
  const theme = VERDICT_THEME[verdict];
  const width = Math.max(2, Math.min(100, score));

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Risk Level</span>
        <span className={`text-2xl font-extrabold tabular-nums ${theme.text}`}>{score}%</span>
      </div>
      <div className={`h-3 w-full overflow-hidden rounded-full ${theme.track}`}>
        <div
          className={`h-full rounded-full ${theme.bar} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${theme.icon}`} />
        <span className={`text-sm font-bold ${theme.text}`}>{theme.label}</span>
      </div>
    </div>
  );
}
