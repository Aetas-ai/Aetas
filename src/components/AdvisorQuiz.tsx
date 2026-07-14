import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Users, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<'ai' | 'security' | 'global' | 'mixed' | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleSelect = (value: 'ai' | 'security' | 'global') => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: ('ai' | 'security' | 'global')[]) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
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
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glowing lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-sky-500 to-amber-500 opacity-70"></div>

      {result ? (
          <motion.div
            key="result"
            initial={hasHydrated ? { opacity: 0, scale: 0.97 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-center py-6"
          >
            <div className="inline-flex p-4 rounded-full bg-white/5 border border-white/10 mb-6">
              {result === 'security' && <Shield className="w-12 h-12 text-sky-400" />}
              {result === 'global' && <Users className="w-12 h-12 text-amber-500" />}
              {result === 'ai' && <Brain className="w-12 h-12 text-indigo-400" />}
              {result === 'mixed' && <Brain className="w-12 h-12 text-purple-400" />}
            </div>

            <h3 className="text-3xl font-display font-bold text-white mb-3">
              {result === 'security' && 'Aetas Security'}
              {result === 'global' && 'Aetas Global'}
              {result === 'ai' && 'Aetas AI (Workflow Automation)'}
              {result === 'mixed' && 'Multiple Aetas Practices'}
            </h3>

            <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              {result === 'security' && 'Your needs fit Aetas Security. We can scope Managed Extended Detection and Response (MXDR), Network Security Testing, or Application Security Testing (Pen Testing).'}
              {result === 'global' && 'Your needs fit Aetas Global. We can scope Help Desk as a Service, Product Support as a Service, managed IT, or Business Processes responsibilities.'}
              {result === 'ai' && 'Your goals fit Aetas AI. We can scope Human Led AI and Business Process AI Assimilation with Expert Human Oversight of AI (Expert in the Loop).'}
              {result === 'mixed' && 'Your needs span more than one Aetas practice. We suggest one scoping conversation that routes each requirement to the separate Security, Global, or AI service team responsible for it.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`/contact?intent=${result === 'mixed' ? 'general' : result}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                <span>{result === 'ai' ? 'Discuss AI Services' : 'Schedule Scoping Call'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={hasHydrated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <h4 className="text-xl font-display font-semibold text-white mb-2">Reviewing Your Answers</h4>
            <p className="text-gray-400 text-sm">Matching the request to the appropriate Aetas practice...</p>
          </motion.div>
        ) : (
          <motion.div
            key={currentStep}
            initial={hasHydrated ? { opacity: 0, x: 16 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Question {currentStep + 1} of {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      idx <= currentStep ? 'bg-indigo-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-8 leading-tight">
              {questions[currentStep].text}
            </h3>

            <div className="space-y-4">
              {questions[currentStep].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full text-left p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/20 transition-all flex items-start gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center mt-0.5 group-hover:border-indigo-400 group-hover:bg-indigo-400/10 transition-all shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-indigo-400 transition-all" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {opt.text}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
    </div>
  );
}
