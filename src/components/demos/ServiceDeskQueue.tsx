import { useMemo, useState } from 'react';
import { CircleCheck, CornerDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { deskQueues, type DeskLocation, type DeskQueue, type DeskTier } from '../../data/demos';
import { DemoWindow, SIMULATED_CAPTION, StepTimer, useSteps } from './demo-runtime';

const tiers: DeskTier[] = ['L1', 'L2', 'L3'];
const STEP_MS = 2100;

function boardAt(queue: DeskQueue, step: number) {
  const location: Record<string, DeskLocation> = { ...queue.initial };
  const resolved: string[] = [];
  queue.events.slice(0, step).forEach((event) => {
    location[event.ticket] = event.to;
    if (event.to === 'resolved') resolved.unshift(event.ticket);
  });
  return { location, resolved, last: step > 0 ? queue.events[step - 1] : undefined };
}

function ServiceDeskBody({ queueKey }: { queueKey: DeskQueue['key'] }) {
  const queue = deskQueues.find((item) => item.key === queueKey) ?? deskQueues[0];
  const durations = useMemo(() => Array.from({ length: queue.events.length + 1 }, () => STEP_MS), [queue]);
  const clock = useSteps(durations, { initial: 5, reducedStep: 5 });
  const { location, resolved, last } = boardAt(queue, clock.step);
  const tickets = new Map(queue.tickets.map((ticket) => [ticket.id, ticket]));

  return (
    <div>
      <StepTimer clock={clock} />
      <div className="grid grid-cols-3 gap-2 p-3 sm:gap-3 sm:p-4">
        {tiers.map((tier) => {
          const items = queue.tickets.filter((ticket) => location[ticket.id] === tier);
          return (
            <section key={tier} className="min-w-0 rounded-lg border border-white/[0.06] bg-black/20 p-1.5 sm:p-2" aria-label={`${tier} ${queue.tiers[tier]}`}>
              <header className="flex items-center justify-between gap-1 px-1 pb-2">
                <span className="min-w-0">
                  <span className="font-display text-[0.8125rem] font-semibold text-white">{tier}</span>
                  <span className="ml-1.5 hidden text-[0.6875rem] text-gray-400 sm:inline">{queue.tiers[tier]}</span>
                </span>
                <span className="agi-mono text-gray-500">{items.length}</span>
              </header>
              <ul className="grid min-h-[11.5rem] grid-cols-1 content-start gap-1.5">
                {items.map((ticket) => {
                  const moved = last?.ticket === ticket.id;
                  return (
                    <li
                      key={`${ticket.id}-${tier}`}
                      className={cn(
                        'agi-row-in rounded-md border p-1.5 sm:p-2',
                        moved ? 'border-amber-300/40 bg-amber-300/[0.07]' : 'border-white/[0.07] bg-[var(--surface-3)]',
                      )}
                    >
                      <span className="flex items-center justify-between gap-1">
                        <span className="agi-mono text-gray-400">{ticket.id}</span>
                        <span className="agi-chip hidden xl:inline-flex">{ticket.category}</span>
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] font-medium leading-snug text-gray-100 sm:text-[0.8125rem]">{ticket.title}</span>
                      <span className="agi-mono mt-1 hidden text-gray-500 sm:block">Target {ticket.target}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2 border-t border-white/[0.06] px-3 py-3 sm:px-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <p key={clock.step} className="agi-fade-in flex min-w-0 items-center gap-2 text-[0.8125rem] text-gray-200">
          <CornerDownRight className="h-3.5 w-3.5 flex-none text-amber-300" aria-hidden="true" />
          <span className="truncate">{last ? last.note : 'Queue snapshot · start of shift'}</span>
        </p>
        <div className="flex min-w-0 items-center gap-1.5 md:justify-end">
          <span className="agi-label flex-none">Resolved</span>
          {resolved.slice(0, 3).map((id) => (
            <span key={id} className="agi-chip agi-chip--ok agi-row-in" title={tickets.get(id)?.title}>
              <CircleCheck className="h-3 w-3" aria-hidden="true" />
              {id}
            </span>
          ))}
          {resolved.length === 0 && <span className="text-[0.75rem] text-gray-500">None yet</span>}
        </div>
      </div>
    </div>
  );
}

export default function ServiceDeskQueue() {
  const [queueKey, setQueueKey] = useState<DeskQueue['key']>('helpdesk');
  return (
    <DemoWindow
      title="Service desk · tiered queue"
      accent="global"
      halo
      description="Simulated tiered support queue. Requests arrive at L1, are resolved and documented there or escalated to L2 and L3 with handoff notes. Switch between the Help Desk and Product Support queues."
      caption={<>Switch queues to compare Help Desk and Product Support. {SIMULATED_CAPTION}</>}
      toolbar={
        <span className="agi-segment hidden sm:inline-flex" role="group" aria-label="Queue">
          {deskQueues.map((item) => (
            <button key={item.key} type="button" aria-pressed={item.key === queueKey} onClick={() => setQueueKey(item.key)}>{item.label}</button>
          ))}
        </span>
      }
    >
      <div className="flex border-b border-white/[0.06] px-3 py-2 sm:hidden">
        <span className="agi-segment" role="group" aria-label="Queue">
          {deskQueues.map((item) => (
            <button key={item.key} type="button" aria-pressed={item.key === queueKey} onClick={() => setQueueKey(item.key)}>{item.label}</button>
          ))}
        </span>
      </div>
      <ServiceDeskBody key={queueKey} queueKey={queueKey} />
    </DemoWindow>
  );
}
