import { useState, useCallback } from 'react';
import { Search, Loader2, Info } from 'lucide-react';
import { Header } from '@/components/Header';
import { SourceTabs } from '@/components/SourceTabs';
import { DemoButtons } from '@/components/DemoButtons';
import { MessageInput } from '@/components/MessageInput';
import { ResultCard } from '@/components/ResultCard';
import { ScanHistory } from '@/components/ScanHistory';
import { Footer } from '@/components/Footer';
import { SOURCES, DEMO_MESSAGES } from '@/data';
import { scanMessage } from '@/lib/scan';
import type { SourceId, DemoMessage, ScanResult, ScanHistoryItem } from '@/types';

function App() {
  const [source, setSource] = useState<SourceId>('sms');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scannedText, setScannedText] = useState('');
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  const activeSource = SOURCES.find((s) => s.id === source)!;

  const handleSourceChange = (id: SourceId) => {
    setSource(id);
    setResult(null);
    setError(null);
  };

  const handlePickDemo = (demo: DemoMessage) => {
    setMessage(demo.text);
    setResult(null);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage((prev) => (prev ? prev + ' ' + text : text));
      }
    } catch {
      // clipboard permission denied — silently ignore
    }
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
    setError(null);
  };

  const handleScan = useCallback(async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setScannedText(message.trim());
    try {
      const res = await scanMessage(source, message.trim());
      setResult(res);
      setHistory((prev) =>
        [
          {
            ...res,
            id: crypto.randomUUID(),
            source,
            text: message.trim().slice(0, 80),
            created_at: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 3),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [message, loading, source]);

  const handleClearHistory = () => setHistory([]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero */}
        <section className="mb-6 text-center sm:mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Check any message before you act
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-500 sm:text-base">
            Paste a suspicious SMS, UPI request, call transcript, or link. ScamShield analyses it
            instantly and tells your family exactly what to do.
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-5">
          {/* Left: input column */}
          <div className="space-y-5 lg:col-span-3">
            <div className="card p-4 sm:p-5">
              <h3 className="mb-3 text-sm font-bold text-ink-700">Where did the message come from?</h3>
              <SourceTabs sources={SOURCES} active={source} onChange={handleSourceChange} />
            </div>

            <DemoButtons demos={DEMO_MESSAGES} activeSource={source} onPick={handlePickDemo} />

            <MessageInput
              source={activeSource}
              value={message}
              onChange={setMessage}
              onPaste={handlePaste}
              onClear={handleClear}
            />

            <button
              onClick={handleScan}
              disabled={!message.trim() || loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Check This Message
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-danger-200 bg-danger-50 p-3.5 text-sm text-danger-700">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right: result column */}
          <div className="space-y-5 lg:col-span-2">
            {result ? (
              <ResultCard result={result} scannedText={scannedText} />
            ) : (
              !loading && (
                <div className="card flex h-full min-h-[280px] flex-col items-center justify-center p-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                    <Search className="h-7 w-7" strokeWidth={2} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink-700">Your scan result will appear here</p>
                  <p className="mt-1 max-w-xs text-xs text-ink-400">
                    Paste a message or tap a demo sample, then press Check This Message.
                  </p>
                </div>
              )
            )}

            <ScanHistory items={history} onClear={handleClearHistory} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
