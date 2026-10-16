import React, { useEffect, useRef, useState } from 'react';
import { Shield, Brain, Users, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    value: 'ai' | 'security' | 'global';
    description: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is your organization's primary challenge right now?",
    options: [
      {
        text: "We need managed detection or offensive security testing",
        value: "security",
        description: "Scope Managed Extended Detection and Response (MXDR), Network Security Testing, or Application Security Testing."
      },
      {
        text: "Our internal IT helpdesk & operations are overwhelmed",
        value: "global",
        description: "Define helpdesk, identity, device, tenant, or outsourced support responsibilities."
      },
      {
        text: "We want to automate manual workflows with custom AI",
        value: "ai",
        description: "Design Human Led AI around repetitive Business Processes with Expert Human Oversight of AI."
      }
    ]
  },
  {
    id: 2,
    text: "What is your primary operational bottleneck?",
    options: [
      {
        text: "Managed detection or offensive security testing",
        value: "security",
        description: "MXDR, Network Security Testing, or Application Security Testing (Pen Testing)."
      },
      {
        text: "Recurring IT requests and software administration",
        value: "global",
        description: "Helpdesk queues, access requests, onboarding, device management, and tenant upkeep."
      },
      {
        text: "Repetitive processing, drafting, or ticket routing",
        value: "ai",
        description: "Identify steps where AI can assist while people retain review and approval."
      }
    ]
  },
  {
    id: 3,
    text: "Which engagement best matches the work you described?",
    options: [
      {
        text: "Establish MXDR or Offensive Security coverage",
        value: "security",
        description: "Select Managed Extended Detection and Response or a focused security testing engagement."
      },
      {
        text: "Apply AI to Business Processes workflows",
        value: "ai",
        description: "Collaborate with our team on Human Led AI and Business Process AI Assimilation."
      },
      {
        text: "Assign recurring IT or support responsibilities",
        value: "global",
        description: "Define helpdesk, tenant, device, identity, or Business Processes queue ownership and escalation."
      }
    ]
  }
];

export default function AdvisorQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<('ai' | 'security' | 'global')[]>([]);
  const [result, setResult] = useState<'ai' | 'security' | 'global' | 'mixed' | null>(null);
  // The first render matches the server HTML; later steps animate in and
  // receive focus so keyboard and screen reader users follow the change.
  const [interacted, setInteracted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (interacted) heading.current?.focus({ preventScroll: true });
  }, [currentStep, result, interacted]);

  const handleSelect = (value: 'ai' | 'security' | 'global') => {
    setInteracted(true);
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  // The result is a simple tally, shown immediately rather than behind an
  // artificial "analyzing" delay.
  const calculateResult = (finalAnswers: ('ai' | 'security' | 'global')[]) => {
      // Tally answers
      const counts = finalAnswers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {} as Record<'ai' | 'security' | 'global', number>);

      // Check top answer
      let topPillar: 'ai' | 'security' | 'global' | 'mixed' = 'mixed';
      let maxCount = 0;
      
      Object.entries(counts).forEach(([key, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topPillar = key as 'ai' | 'security' | 'global';
        } else if (count === maxCount) {
          topPillar = 'mixed';
        }
      });

      setResult(topPillar);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-lg p-5 shadow-2xl glass-panel sm:p-8">
      {/* Decorative gradient glowing lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-sky-500 to-amber-500 opacity-70"></div>

      {result ? (
          <div key="result" className="agi-swap-in text-center py-6">
            <div className="inline-flex p-4 rounded-full bg-white/5 border border-white/10 mb-6">
              {result === 'security' && <Shield className="w-12 h-12 text-sky-400" />}
              {result === 'global' && <Users className="w-12 h-12 text-amber-500" />}
              {result === 'ai' && <Brain className="w-12 h-12 text-indigo-400" />}
              {result === 'mixed' && <Brain className="w-12 h-12 text-purple-400" />}
            </div>

            <h3 ref={heading} tabIndex={-1} className="text-3xl font-display font-bold text-white mb-3 focus:outline-none">
              {result === 'security' && 'AGI Cybersecurity'}
              {result === 'global' && 'AGI Managed IT'}
              {result === 'ai' && 'AGI AI & Automation'}
              {result === 'mixed' && 'Multiple AGI Services'}
            </h3>

            <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              {result === 'security' && 'Your needs fit AGI cybersecurity services. We can scope Managed Extended Detection and Response (MXDR), Network Security Testing, or Application Security Testing (Pen Testing).'}
              {result === 'global' && 'Your needs fit AGI managed IT services. We can scope Help Desk as a Service, Product Support as a Service, managed IT, or Business Processes responsibilities.'}
              {result === 'ai' && 'Your goals fit AGI AI and automation services. We can scope Human Led AI and Business Process AI Assimilation with Expert Human Oversight of AI (Expert in the Loop).'}
              {result === 'mixed' && 'Your needs span more than one AGI service. We suggest one scoping conversation so the appropriate AI, cybersecurity, and managed IT specialists can define each requirement.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`/contact?intent=${result === 'mixed' ? 'general' : result === 'global' ? 'managed-it' : result}`}
                className="agi-btn agi-btn--dark-primary w-full sm:w-auto px-8"
              >
                <span>{result === 'ai' ? 'Discuss AI Services' : 'Schedule Scoping Call'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={resetQuiz}
                className="agi-btn agi-btn--dark-secondary w-full sm:w-auto px-8"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            </div>
          </div>
        ) : (
          <div key={currentStep} className={interacted ? 'agi-swap-in' : undefined}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Question {currentStep + 1} of {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                      idx <= currentStep ? 'bg-indigo-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 ref={heading} tabIndex={-1} className="text-2xl font-display font-bold text-white mb-8 leading-tight focus:outline-none">
              {questions[currentStep].text}
            </h3>

            <div className="space-y-4">
              {questions[currentStep].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className="group flex min-h-12 w-full items-start gap-4 rounded-lg border border-white/8 bg-white/[0.02] p-4 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-white/20 hover:bg-white/5 motion-reduce:hover:translate-y-0 sm:p-5"
                >
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center mt-0.5 group-hover:border-indigo-400 group-hover:bg-indigo-400/10 group-focus-visible:border-indigo-400 transition-colors shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-indigo-400 group-focus-visible:bg-indigo-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {opt.text}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
