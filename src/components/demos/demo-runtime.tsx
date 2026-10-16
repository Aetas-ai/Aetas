/**
 * Shared runtime for the code-rendered service demos.
 *
 * DemoWindow draws the product-window chrome (with an always-visible
 * "Simulated" label) and decides whether the demo may advance: only
 * while it is on screen, the tab is visible, the visitor has not paused it,
 * and reduced motion is not requested. Demo bodies read that through
 * useSteps(), so they stay simple step machines.
 */
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '../../lib/utils';

export type DemoAccent = 'ai' | 'security' | 'global';

interface DemoEnv {
  running: boolean;
  reduced: boolean;
  pause: () => void;
}

const DemoContext = createContext<DemoEnv>({ running: false, reduced: false, pause: () => {} });

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(element);
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ref]);
  return inView && pageVisible;
}

export interface StepClock {
  step: number;
  count: number;
  cycle: number;
  duration: number;
  running: boolean;
  reduced: boolean;
  timerKey: string;
  /** Jump to a step. Pass pause to hand control to the visitor. */
  goTo: (step: number, options?: { pause?: boolean }) => void;
}

/**
 * Advances through `durations.length` steps while the surrounding DemoWindow
 * is running, looping and calling onCycle after the last step. Under reduced
 * motion it rests on `reducedStep`, a complete and meaningful frame.
 */
export function useSteps(
  durations: readonly number[],
  { initial = 0, reducedStep = durations.length - 1, onCycle }: { initial?: number; reducedStep?: number; onCycle?: () => void } = {},
): StepClock {
  const { running, reduced, pause } = useContext(DemoContext);
  const [step, setStep] = useState(initial);
  const [cycle, setCycle] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const onCycleRef = useRef(onCycle);
  onCycleRef.current = onCycle;
  const count = durations.length;
  const duration = durations[step] ?? 0;

  useEffect(() => {
    if (reduced) setStep(reducedStep);
  }, [reduced, reducedStep]);

  // Restart the visible step timer whenever playback resumes.
  useEffect(() => {
    if (running) setEpoch((value) => value + 1);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (step + 1 >= count) {
        setCycle((value) => value + 1);
        setStep(0);
        onCycleRef.current?.();
      } else {
        setStep(step + 1);
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [running, step, duration, count, epoch]);

  const goTo = useCallback(
    (next: number, options?: { pause?: boolean }) => {
      setStep(Math.max(0, Math.min(count - 1, next)));
      setEpoch((value) => value + 1);
      if (options?.pause) pause();
    },
    [count, pause],
  );

  return { step, count, cycle, duration, running, reduced, timerKey: `${step}-${cycle}-${epoch}`, goTo };
}

/** Thin progress line for the current step, or manual controls under reduced motion. */
export function StepTimer({ clock, labels }: { clock: StepClock; labels?: readonly string[] }) {
  if (clock.reduced) {
    return (
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-1.5">
        <span className="agi-label">
          Step {clock.step + 1} of {clock.count}
          {labels?.[clock.step] ? <span className="ml-2 normal-case tracking-normal text-gray-300">{labels[clock.step]}</span> : null}
        </span>
        <span className="flex gap-1">
          <button type="button" className="agi-window-control" onClick={() => clock.goTo(clock.step - 1)} disabled={clock.step === 0} aria-label="Previous step">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" className="agi-window-control" onClick={() => clock.goTo(clock.step + 1)} disabled={clock.step === clock.count - 1} aria-label="Next step">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="agi-step-timer" data-paused={clock.running ? undefined : ''} aria-hidden="true">
      <span key={clock.timerKey} style={{ animationDuration: `${clock.duration}ms` }} />
    </div>
  );
}

interface DemoWindowProps {
  title: string;
  accent: DemoAccent;
  /** Screen-reader description of what the demo illustrates. */
  description: string;
  caption?: ReactNode;
  toolbar?: ReactNode;
  autoplay?: boolean;
  halo?: boolean;
  className?: string;
  children: ReactNode;
}

export function DemoWindow({ title, accent, description, caption, toolbar, autoplay = true, halo = false, className, children }: DemoWindowProps) {
  const ref = useRef<HTMLElement>(null);
  const descriptionId = useId();
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(ref);
  const [playing, setPlaying] = useState(true);
  const running = autoplay && playing && onScreen && !reduced;
  const pause = useCallback(() => setPlaying(false), []);
  const env = useMemo(() => ({ running, reduced, pause }), [running, reduced, pause]);

  return (
    <DemoContext.Provider value={env}>
      <div className={cn('min-w-0', halo && 'agi-window-halo', `accent-${accent}`, className)}>
        <figure ref={ref} className="agi-window" aria-describedby={descriptionId} data-motion>
          <div className="agi-window-bar">
            <span className="agi-window-dots" aria-hidden="true"><span /><span /><span /></span>
            <span className="agi-window-title">{title}</span>
            {toolbar}
            <span className="agi-sim-badge">Simulated</span>
            {autoplay && !reduced ? (
              <button
                type="button"
                className="agi-window-control"
                onClick={() => setPlaying((value) => !value)}
                aria-label={playing ? 'Pause demonstration' : 'Play demonstration'}
              >
                {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            ) : null}
          </div>
          <p id={descriptionId} className="sr-only">{description}</p>
          {children}
          {caption ? <figcaption className="agi-window-caption">{caption}</figcaption> : null}
        </figure>
      </div>
    </DemoContext.Provider>
  );
}

export const SIMULATED_CAPTION = 'Illustrative example with simulated data, not a live system.';
