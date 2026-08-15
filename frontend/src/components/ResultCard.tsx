import { ShieldX, ShieldAlert, ShieldCheck, ListChecks, Brain, Share2, AlertTriangle, Cpu } from 'lucide-react';
import type { ScanResult } from '@/types';
import { RiskGauge } from './RiskGauge';

interface Props {
  result: ScanResult;
  scannedText: string;
}

const VERDICT_BADGE = {
  block: {
    icon: ShieldX,
    label: 'Block & Alert',
    cls: 'bg-danger-50 text-danger-700 ring-danger-200',
    iconCls: 'text-danger-600',
  },
  verify: {
    icon: ShieldAlert,
    label: 'Verify Carefully',
    cls: 'bg-warn-50 text-warn-700 ring-warn-200',
    iconCls: 'text-warn-600',
  },
  safe: {
    icon: ShieldCheck,
    label: 'Safe',
    cls: 'bg-ok-50 text-ok-700 ring-ok-200',
    iconCls: 'text-ok-600',
  },
};

export function ResultCard({ result, scannedText }: Props) {
  const badge = VERDICT_BADGE[result.verdict];
  const Icon = badge.icon;

  const shareWarning = async () => {
    const text = `⚠️ ScamShield Warning ⚠️\n\nVerdict: ${badge.label}\nRisk: ${result.risk_score}%\n\n${result.actions
      .map((a) => `• ${a}`)
      .join('\n')}\n\nStay safe. Report fraud to 1930.`;
    const shareData: ShareData = {
      title: 'ScamShield Warning',
      text,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // user cancelled — no action needed
    }
  };

  return (
    <div className="card animate-fade-up overflow-hidden">
      <div className="border-b border-ink-100 p-4 sm:p-5">
        {result.local_analysis && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700">
            <Cpu className="h-3.5 w-3.5 flex-shrink-0" />
            On-device analysis — cloud scanner was unavailable, so this was checked locally.
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${badge.cls}`}>
              <Icon className={`h-5 w-5 ${badge.iconCls}`} strokeWidth={2.4} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Verdict</p>
              <p className="text-base font-bold text-ink-900">{badge.label}</p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <RiskGauge score={result.risk_score} verdict={result.verdict} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-bold text-ink-700">AI Forensic Explanation</h3>
          </div>
          <p className="text-sm leading-relaxed text-ink-600">
            {result.explanation || 'No detailed explanation was returned. Follow the action checklist below to stay safe.'}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-bold text-ink-700">Immediate Action Checklist</h3>
          </div>
          <ul className="space-y-2">
            {result.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-600">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-brand-50 text-xs font-bold text-brand-600">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {result.verdict !== 'safe' && (
        <div className="border-t border-ink-100 bg-danger-50/40 px-4 py-3 sm:px-5">
          <div className="flex items-start gap-2 text-sm text-danger-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              If money or personal details were shared, call the{' '}
              <span className="font-bold">Cyber Crime Helpline 1930</span> immediately.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 p-4 sm:px-5">
        <button onClick={shareWarning} className="btn-primary">
          <Share2 className="h-4 w-4" />
          Share Warning to WhatsApp
        </button>
        <span className="text-xs text-ink-400">
          Share this warning with family & friends to keep them safe.
        </span>
      </div>
    </div>
  );
}
