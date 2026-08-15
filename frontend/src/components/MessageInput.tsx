import { Clipboard, Trash2 } from 'lucide-react';
import type { Source } from '@/types';

interface Props {
  source: Source;
  value: string;
  onChange: (v: string) => void;
  onPaste: () => void;
  onClear: () => void;
}

export function MessageInput({ source, value, onChange, onPaste, onClear }: Props) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="message" className="text-sm font-semibold text-ink-700">
          Message to check
        </label>
        <span className={`text-xs font-medium ${value.length > 0 ? 'text-ink-400' : 'text-ink-300'}`}>
          {value.length} characters
        </span>
      </div>

      <textarea
        id="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={source.placeholder}
        rows={6}
        className="w-full resize-y rounded-xl border border-ink-200 bg-ink-50/50 px-4 py-3 text-sm text-ink-800 placeholder:text-ink-300 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onPaste} className="btn-soft">
          <Clipboard className="h-4 w-4" />
          Paste
        </button>
        <button onClick={onClear} className="btn-ghost" disabled={value.length === 0}>
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
