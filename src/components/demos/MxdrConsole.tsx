import { useState } from 'react';
import { FileText, Radar, ScanSearch, ShieldCheck, Siren } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mxdrAlerts, mxdrStages, type Severity } from '../../data/demos';
import { DemoWindow, SIMULATED_CAPTION, StepTimer, useSteps } from './demo-runtime';

const DURATIONS = [2000, 2300, 2600, 3000, 3000] as const;
const stageIcons = [Siren, Radar, ScanSearch, ShieldCheck, FileText];

const severityLabel: Record<Severity, string> = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

function MxdrBody() {
  const [alertIndex, setAlertIndex] = useState(0);
  const clock = useSteps(DURATIONS, {
    initial: 3,
    onCycle: () => {
      setAlertIndex((value) => (value + 1) % mxdrAlerts.length);
    },
  });
  const alert = mxdrAlerts[alertIndex];
  const visibleAlerts = mxdrAlerts;

  const select = (index: number) => {
    setAlertIndex(index);
    clock.goTo(0);
  };

  return (
    <div>
      <StepTimer clock={clock} labels={mxdrStages} />
      <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="min-w-0 border-b border-white/[0.06] p-2 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <p className="agi-label">Detections</p>
            <p className="agi-mono text-gray-500">{visibleAlerts.length} open</p>
          </div>
          <ul className="grid grid-cols-1 gap-1">
            {visibleAlerts.map((item, index) => {
              const selected = index === alertIndex;
              return (
                <li key={item.id}>
                  <button type="button" className="agi-row items-start" data-selected={selected ? '' : undefined} onClick={() => select(index)} aria-pressed={selected}>
                    <span className={cn('agi-chip agi-chip--dot mt-0.5 w-[4.6rem] justify-start', `agi-chip--${item.severity}`)}>{severityLabel[item.severity]}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8125rem] font-medium text-gray-100">{item.title}</span>
                      <span className="agi-mono block truncate text-gray-500">{item.source} · {item.asset}</span>
                    </span>
                    <span className="agi-mono flex-none text-gray-500">{item.age}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-h-[24rem] min-w-0 p-4">
          <div key={alert.id} className="agi-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="agi-mono text-gray-400">{alert.id} · {alert.source}</p>
                <p className="mt-1 font-display text-[0.9375rem] font-semibold text-white">{alert.title}</p>
                <p className="agi-mono mt-0.5 truncate text-gray-400">{alert.asset}</p>
              </div>
              <span className={cn('agi-chip agi-chip--dot', `agi-chip--${alert.severity}`)}>{severityLabel[alert.severity]}</span>
            </div>

            <ol className="relative mt-4 grid grid-cols-1 gap-3 before:absolute before:bottom-2 before:left-[0.6875rem] before:top-2 before:w-px before:bg-white/10">
              {mxdrStages.map((stage, index) => {
                const Icon = stageIcons[index];
                const reached = clock.step >= index;
                const current = clock.step === index;
                return (
                  <li key={stage} className={cn('relative flex gap-3 transition-opacity duration-300', reached ? 'opacity-100' : 'opacity-35')}>
                    <span
                      className={cn(
                        'relative z-10 inline-grid h-[1.375rem] w-[1.375rem] flex-none place-items-center rounded-full border transition-colors duration-300',
                        current
                          ? 'border-[color-mix(in_srgb,var(--color-accent)_60%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] text-white'
                          : reached
                            ? 'border-white/15 bg-[var(--surface-3)] text-gray-300'
                            : 'border-white/10 bg-[var(--surface-2)] text-gray-500',
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="h-3 w-3" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2">
                        <span className="text-[0.75rem] font-semibold text-white">{stage}</span>
                        {index === 3 && current && <span className="agi-chip agi-chip--pending agi-chip--dot agi-pulse">Analyst approval</span>}
                        {index === 3 && clock.step > 3 && <span className="agi-chip agi-chip--review">Analyst approved</span>}
                        {current && index !== 3 && clock.running && <span className="agi-chip agi-chip--info agi-pulse">In progress</span>}
                      </p>
                      {reached ? (
                        <p className="mt-0.5 text-[0.8125rem] leading-snug text-gray-300">{alert.timeline[index]}</p>
                      ) : (
                        <div className="mt-1.5 h-2.5 w-3/5 rounded bg-white/[0.06]" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MxdrConsole() {
  return (
    <DemoWindow
      title="MXDR · detection and response"
      accent="security"
      halo
      description="Simulated managed detection and response console. Detections are listed by severity; the selected detection moves through detect, triage, investigate, analyst-approved containment, and client reporting. Select a detection to follow its response."
      caption={<>Select a detection to follow its response. {SIMULATED_CAPTION}</>}
    >
      <MxdrBody />
    </DemoWindow>
  );
}
