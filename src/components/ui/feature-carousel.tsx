import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Brain, CheckCircle2, Headphones, Pause, Play, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ResponsiveImage } from '../../lib/visuals';

interface FeatureStep {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  bullets: string[];
  imageAlt: string;
}

const steps: FeatureStep[] = [
  {
    eyebrow: 'AI & Automation',
    title: 'Apply Human Led AI to Business Processes',
    description:
      'AGI maps repetitive operational work and designs Human Led AI assistance for intake, routing, drafting, summarization, knowledge retrieval, and quality review.',
    icon: <Brain className="h-5 w-5" />,
    accent: 'from-indigo-400 to-violet-500',
    bullets: ['Business Process AI Assimilation', 'Human Led AI', 'Expert in the Loop'],
    imageAlt: 'Conceptual visualization of an AI-assisted Business Processes workflow',
  },
  {
    eyebrow: 'Cybersecurity',
    title: 'Strengthen security with managed expertise',
    description:
      'AGI provides MSSP expertise through Managed Extended Detection and Response (MXDR), Network Security Testing, and Application Security Testing (Pen Testing).',
    icon: <Shield className="h-5 w-5" />,
    accent: 'from-sky-400 to-cyan-500',
    bullets: ['MXDR', 'Network Security Testing', 'Application Security Testing'],
    imageAlt: 'Conceptual visualization of cybersecurity monitoring and response',
  },
  {
    eyebrow: 'Managed IT',
    title: 'Run recurring IT and Business Processes work',
    description:
      'AGI provides MSP expertise through Help Desk as a Service, Product Support as a Service, managed IT, and Business Processes operations.',
    icon: <Headphones className="h-5 w-5" />,
    accent: 'from-amber-300 to-orange-500',
    bullets: ['Help Desk as a Service', 'Product Support as a Service', 'Business Processes operations'],
    imageAlt: 'Conceptual visualization of managed IT and Business Processes operations',
  },
];

const ROTATION_MS = 6000;

interface FeatureCarouselProps {
  /** One optimized image per step, resolved by the Astro page. */
  images: ResponsiveImage[];
}

export default function FeatureCarousel({ images }: FeatureCarouselProps) {
  const [active, setActive] = useState(0);
  // Auto-rotation is opt-out: it stops for reduced motion, after any manual
  // choice, or via the pause control, and holds while hovered, focused, or
  // scrolled out of view.
  const [autoplay, setAutoplay] = useState(true);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoplay(false);
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay || held || !visible) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % steps.length), ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, held, visible]);

  const selectStep = (index: number) => {
    setAutoplay(false);
    setInteracted(true);
    setActive(index);
  };

  const current = steps[active];
  const image = images[active];

  return (
    <div
      ref={root}
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Aetas Global Innovation services"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.25fr] lg:items-stretch">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {steps.map((step, index) => {
            const selected = index === active;

            return (
              <button
                key={step.title}
                type="button"
                onClick={() => selectStep(index)}
                aria-pressed={selected}
                aria-controls="feature-carousel-panel"
                className={cn(
                  'group relative overflow-hidden rounded-lg border p-4 text-left transition-[background-color,border-color,box-shadow] duration-300',
                  selected
                    ? 'border-white/20 bg-white/[0.07] shadow-xl shadow-black/20'
                    : 'border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.045]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-black shadow-lg',
                      step.accent
                    )}
                  >
                    {step.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      {String(index + 1).padStart(2, '0')} / {step.eyebrow}
                    </p>
                    <h3 className={cn('mt-1 text-sm font-bold leading-snug', selected ? 'text-white' : 'text-gray-300')}>
                      {step.title}
                    </h3>
                  </div>
                </div>
                {/* The bar restarts with the timer whenever rotation resumes. */}
                {selected && autoplay && !held && visible && (
                  <span
                    key={`progress-${active}`}
                    className={cn('feature-carousel-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r', step.accent)}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          id="feature-carousel-panel"
          className="relative min-h-[500px] overflow-hidden rounded-lg border border-white/10 bg-brand-bg shadow-2xl shadow-black/30 max-sm:min-h-[560px]"
        >
          {image && (
            <img
              key={image.src}
              src={image.src}
              srcSet={image.srcset}
              sizes="(min-width: 1024px) 44rem, 100vw"
              alt={current.imageAlt}
              className="agi-fade-in absolute inset-0 h-full w-full object-cover opacity-45"
              loading="lazy"
              decoding="async"
              width={image.width}
              height={image.height}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/48 to-black/72"></div>

          <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-5 sm:p-8 max-sm:min-h-[560px]">
            <div key={current.title} className={cn('max-w-xl', interacted || autoplay ? 'agi-swap-in' : undefined)} aria-live={autoplay ? 'off' : 'polite'}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-300">
                <span className={cn('h-2 w-2 rounded-full bg-gradient-to-r', current.accent)}></span>
                Specialized AGI service
              </div>
              <h3 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                {current.title}
              </h3>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-gray-300">
                {current.description}
              </p>
            </div>

            <div className="grid gap-3 pb-14 sm:grid-cols-3 sm:pb-0">
              {current.bullets.map((bullet, index) => (
                <div
                  key={`${current.title}-${bullet}`}
                  className="agi-swap-in rounded-lg border border-white/10 bg-black/40 p-4"
                  data-delay={index}
                >
                  <CheckCircle2 className="mb-3 h-4 w-4 text-emerald-300" />
                  <p className="text-sm font-semibold leading-relaxed text-gray-200">{bullet}</p>
                </div>
              ))}
            </div>

            <div className="absolute bottom-5 right-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoplay((value) => !value)}
                aria-label={autoplay ? 'Pause automatic rotation' : 'Resume automatic rotation'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => selectStep((active + 1) % steps.length)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2.5 text-xs font-bold text-black shadow-lg transition-[background-color,transform] hover:bg-white/90 active:scale-95"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
