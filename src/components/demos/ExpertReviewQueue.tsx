import { useEffect, useState } from 'react';
import { BookOpen, Check, CircleCheck, PenLine, Sparkles, TriangleAlert, UserRoundCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { reviewSteps, reviewTickets } from '../../data/demos';
import { DemoWindow, SIMULATED_CAPTION, StepTimer, useSteps } from './demo-runtime';

const DURATIONS = [1800, 1900, 1900, 3400, 3000, 3200] as const;
type Decision = 'approve' | 'edit' | 'escalate';

function useTyped(text: string, active: boolean) {
  const [length, setLength] = useState(text.length);
  useEffect(() => {
    if (!active) {
      setLength(text.length);
      return;
    }
    setLength(0);
    const timer = window.setInterval(() => {
      setLength((value) => {
        if (value >= text.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 3;
      });
    }, 28);
    return () => window.clearInterval(timer);
  }, [text, active]);
  return text.slice(0, length);
}

function Stage({ reached, current, label, icon, children }: { reached: boolean; current: boolean; label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn('flex gap-3 transition-opacity duration-300', reached ? 'opacity-100' : 'opacity-35')}>
      <span
        className={cn(
          'mt-0.5 inline-grid h-6 w-6 flex-none place-items-center rounded-md border transition-colors duration-300',
          current ? 'border-[color-mix(in_srgb,var(--accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent-text)]' : 'border-white/10 bg-white/[0.03] text-gray-400',
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="agi-label">{label}</p>
        <div className="mt-1.5">{reached ? children : <div className="h-3 w-2/3 rounded bg-white/[0.06]" />}</div>
      </div>
    </div>
  );
}

function ExpertReviewBody() {
  const [ticketIndex, setTicketIndex] = useState(0);
  const [decision, setDecision] = useState<Decision | null>(null);
  const clock = useSteps(DURATIONS, {
    initial: 3,
    onCycle: () => {
      setDecision(null);
      setTicketIndex((value) => (value + 1) % reviewTickets.length);
    },
  });
  const { step } = clock;
  const ticket = reviewTickets[ticketIndex];
  const typed = useTyped(ticket.draft, step === 3 && clock.running);
  const outcome: Decision = decision ?? 'approve';

  const decide = (value: Decision) => {
    setDecision(value);
    clock.goTo(5, { pause: true });
  };

  const selectTicket = (index: number) => {
    setTicketIndex(index);
    setDecision(null);
    clock.goTo(0);
  };

  return (
    <div>
      <StepTimer clock={clock} labels={reviewSteps} />
      <div className="grid md:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="border-b border-white/[0.06] p-2 md:border-b-0 md:border-r">
          <p className="agi-label px-2 pb-2 pt-1">Queue · 3 requests</p>
          <ul className="grid grid-cols-1 gap-1">
            {reviewTickets.map((item, index) => {
              const selected = index === ticketIndex;
              return (
                <li key={item.id}>
                  <button type="button" className="agi-row flex-col items-start gap-1" data-selected={selected ? '' : undefined} onClick={() => selectTicket(index)} aria-pressed={selected}>
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="agi-mono text-gray-400">{item.id}</span>
                      {selected ? (
                        <span className={cn('agi-chip', step >= 5 ? 'agi-chip--ok' : step === 4 ? 'agi-chip--pending' : 'agi-chip--ai')}>{reviewSteps[step]}</span>
                      ) : (
                        <span className="agi-chip">{item.channel}</span>
                      )}
                    </span>
                    <span className="line-clamp-1 text-[0.8125rem] font-medium text-gray-100">{item.subject}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-h-[25rem] min-w-0 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="agi-mono text-gray-400">{ticket.id} · {ticket.channel}</p>
              <p className="mt-1 truncate font-display text-[0.9375rem] font-semibold text-white">{ticket.subject}</p>
            </div>
            <span className={cn('agi-chip agi-chip--dot', ticket.priority === 'High' ? 'agi-chip--high' : 'agi-chip--low')}>{ticket.priority}</span>
          </div>
          <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-[0.8125rem] leading-relaxed text-gray-300">“{ticket.message}”</p>

          <div key={ticket.id} className="mt-4 grid grid-cols-1 gap-3.5">
            <Stage reached={step >= 1} current={step === 1} label="AI classification · suggestion" icon={<Sparkles className="h-3.5 w-3.5" />}>
              <div className="flex flex-wrap gap-1.5">
                <span className="agi-chip agi-chip--ai">{ticket.category}</span>
                <span className="agi-chip">Queue: {ticket.queue}</span>
                <span className="agi-chip">Summary ready</span>
              </div>
            </Stage>
            <Stage reached={step >= 2} current={step === 2} label="Context retrieved" icon={<BookOpen className="h-3.5 w-3.5" />}>
              <p className="text-[0.8125rem] text-gray-200">{ticket.sop} <span className="text-gray-400">· approved SOP</span></p>
            </Stage>
            <Stage reached={step >= 3} current={step === 3} label={decision === 'edit' && step >= 5 ? 'Draft · edited by reviewer' : 'AI draft reply'} icon={<PenLine className="h-3.5 w-3.5" />}>
              <p className={cn('text-[0.8125rem] leading-relaxed text-gray-200', step === 3 && clock.running && typed.length < ticket.draft.length && 'agi-caret')}>
                {decision === 'edit' && step >= 5 ? ticket.edited : step === 3 ? typed : ticket.draft}
              </p>
            </Stage>
            <Stage reached={step >= 4} current={step >= 4} label="Expert Human Oversight of AI" icon={<UserRoundCheck className="h-3.5 w-3.5" />}>
              {step === 4 && !decision ? (
                <p className="flex items-center gap-2 text-[0.8125rem] text-gray-200">
                  <span className="agi-chip agi-chip--pending agi-chip--dot agi-pulse">Awaiting expert review</span>
                  <span className="text-gray-400">Nothing is sent until a reviewer decides.</span>
                </p>
              ) : (
                <p className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-gray-200">
                  {outcome === 'escalate' ? (
                    <>
                      <span className="agi-chip agi-chip--high"><TriangleAlert className="h-3 w-3" aria-hidden="true" />Escalated</span>
                      <span>{ticket.escalation}</span>
                    </>
                  ) : (
                    <>
                      <span className="agi-chip agi-chip--ok"><CircleCheck className="h-3 w-3" aria-hidden="true" />{outcome === 'edit' ? 'Edited and approved' : 'Approved'}</span>
                      <span>Reply sent by the reviewer. Decision recorded in the audit trail.</span>
                    </>
                  )}
                </p>
              )}
              <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Reviewer decision">
                {(['approve', 'edit', 'escalate'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => decide(value)}
                    aria-pressed={step >= 5 && outcome === value}
                    className={cn(
                      'inline-flex min-h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors',
                      step >= 5 && outcome === value
                        ? 'border-[color-mix(in_srgb,var(--accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-white'
                        : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:text-white',
                    )}
                  >
                    {value === 'approve' && <Check className="h-3 w-3" aria-hidden="true" />}
                    {value === 'approve' ? 'Approve' : value === 'edit' ? 'Edit' : 'Escalate'}
                  </button>
                ))}
              </div>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpertReviewQueue() {
  return (
    <DemoWindow
      title="Support queue · Human Led AI with expert review"
      accent="ai"
      halo
      description="Simulated support queue. Each request is classified, matched to an approved SOP, and drafted by AI, then waits for an expert reviewer to approve, edit, or escalate before anything is sent. You can choose the reviewer decision."
      caption={<>Try the reviewer decision. {SIMULATED_CAPTION}</>}
    >
      <ExpertReviewBody />
    </DemoWindow>
  );
}
