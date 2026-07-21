import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Brain, CheckCircle2, Headphones, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FeatureStep {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  bullets: string[];
  image: string;
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
    image: '/visual-ai-workflows.webp',
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
    image: '/visual-security-ops.webp',
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
    image: '/visual-global-ops.webp',
    imageAlt: 'Conceptual visualization of managed IT and Business Processes operations',
  },
];

export default function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, 4200);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const selectStep = (index: number) => {
    if (timer.current) window.clearInterval(timer.current);
    setActive(index);
  };

  const current = steps[active];

  return (
    <div className="w-full" role="region" aria-label="Aetas Global Innovation services">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.25fr] lg:items-stretch">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {steps.map((step, index) => {
            const selected = index === active;

            return (
              <button
                key={step.title}
                type="button"
                onClick={() => selectStep(index)}
                className={cn(
                  'group rounded-2xl border p-4 text-left transition-all duration-300',
                  selected
                    ? 'border-white/20 bg-white/[0.07] shadow-xl shadow-black/20'
                    : 'border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.045]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-black shadow-lg',
                      step.accent
                    )}
                  >
                    {step.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {String(index + 1).padStart(2, '0')} / {step.eyebrow}
                    </p>
                    <h3 className={cn('mt-1 text-sm font-bold leading-snug', selected ? 'text-white' : 'text-gray-300')}>
                      {step.title}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#07080d] shadow-2xl shadow-black/30 max-sm:min-h-[560px]">
          <img
            key={current.image}
            src={current.image}
            alt={current.imageAlt}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            loading="lazy"
            decoding="async"
            width="1440"
            height="810"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/48 to-black/72"></div>

          <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-5 sm:p-8 max-sm:min-h-[560px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28 }}
                className="max-w-xl"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                  <span className={cn('h-2 w-2 rounded-full bg-gradient-to-r', current.accent)}></span>
                  Specialized AGI service
                </div>
                <h3 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {current.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-300">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid gap-3 sm:grid-cols-3">
              {current.bullets.map((bullet) => (
                <div key={bullet} className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
                  <CheckCircle2 className="mb-3 h-4 w-4 text-emerald-300" />
                  <p className="text-xs font-semibold leading-relaxed text-gray-200">{bullet}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => selectStep((active + 1) % steps.length)}
              className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2.5 text-xs font-bold text-black shadow-lg transition-all hover:bg-white/90 active:scale-95 sm:flex"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
