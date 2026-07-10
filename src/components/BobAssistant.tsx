import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Brain,
  Building2,
  Headphones,
  Mail,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';

type Topic = 'ai' | 'security' | 'global' | 'contact';

interface ChatMessage {
  id: number;
  role: 'bob' | 'user';
  text: string;
}

interface TopicOption {
  id: Topic;
  label: string;
  short: string;
  icon: React.ReactNode;
}

const introMessage =
  'Hi, I am Bob. I can help you understand Aetas AI, Security, Global operations, and which service may fit your need.';

const topicAnswers: Record<Topic, string> = {
  ai:
    'Aetas AI helps teams automate repetitive workflows and augment BPO, helpdesk, support, and operations work. Common use cases include ticket triage, response drafting, SOP knowledge assistance, QA review, summaries, and workflow routing with human validation.',
  security:
    'Aetas Security supports MDR, SOC operations, penetration testing, vulnerability management, incident response planning, compliance support, and security tool procurement or co-management.',
  global:
    'Aetas Global supports managed IT, BPO, and helpdesk operations including identity tasks, onboarding, device management, tenant administration, support queues, reporting, and always-on operational coverage.',
  contact:
    'If you already know what you need, the contact page is the best next step. Choose Security, Global operations, AI workflow automation, or general inquiries so the request reaches the right Aetas team.',
};

const topicOptions: TopicOption[] = [
  { id: 'ai', label: 'AI workflow automation', short: 'AI workflows', icon: <Brain className="h-4 w-4" /> },
  { id: 'security', label: 'Security services', short: 'Cybersecurity', icon: <Shield className="h-4 w-4" /> },
  { id: 'global', label: 'IT, BPO, helpdesk', short: 'IT / Helpdesk', icon: <Headphones className="h-4 w-4" /> },
  { id: 'contact', label: 'Contact Aetas', short: 'Contact', icon: <Mail className="h-4 w-4" /> },
];

const promptWords = ['Talk to Bob', 'Ask about AI', 'Need cybersecurity?', 'Automate workflows?', 'Helpdesk support?'];

const suggestedQuestions = [
  'What does Aetas AI do?',
  'Can Aetas automate BPO workflows?',
  'Do you provide SOC or MDR services?',
  'Can you help with IT helpdesk?',
];

function getBobReply(input: string) {
  const value = input.toLowerCase();

  if (value.includes('security') || value.includes('soc') || value.includes('mdr') || value.includes('pentest') || value.includes('cyber')) {
    return topicAnswers.security;
  }

  if (value.includes('helpdesk') || value.includes('bpo') || value.includes('msp') || value.includes('it ') || value.includes('identity') || value.includes('support')) {
    return topicAnswers.global;
  }

  if (value.includes('contact') || value.includes('email') || value.includes('call') || value.includes('demo') || value.includes('quote')) {
    return topicAnswers.contact;
  }

  if (value.includes('ai') || value.includes('automation') || value.includes('workflow') || value.includes('agent') || value.includes('llm')) {
    return topicAnswers.ai;
  }

  return 'I can help with Aetas AI, cybersecurity, IT operations, BPO support, and helpdesk services. Tell me what problem you are trying to solve, or choose one of the quick topics below.';
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-label="Bob is typing">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:-0.24s]"></span>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.12s]"></span>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-300"></span>
    </div>
  );
}

function BobAvatar({ isTyping }: { isTyping: boolean }) {
  return (
    <div className="relative h-28 w-24 sm:h-32 sm:w-28" aria-hidden="true">
      <div className={`absolute inset-x-0 top-0 h-[108px] overflow-visible rounded-[28px] shadow-[0_0_34px_rgba(14,165,233,0.22)] sm:h-[124px] ${isTyping ? 'bob-thinking' : ''}`}>
        <img
          src="/bob.png"
          alt=""
          className={`absolute left-1/2 top-1/2 h-[128px] w-[214px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center transition-[filter] duration-500 sm:h-[150px] sm:w-[252px] ${
            isTyping ? 'brightness-110 saturate-125' : 'brightness-100 saturate-100'
          }`}
        />
      </div>
      <div className={`absolute bottom-0 left-5 h-2 w-8 rounded-full bg-sky-400/50 blur-sm ${isTyping ? 'animate-pulse' : ''}`}></div>
      <div className={`absolute bottom-0 right-5 h-2 w-8 rounded-full bg-indigo-400/50 blur-sm ${isTyping ? 'animate-pulse' : ''}`}></div>
    </div>
  );
}

export default function BobAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'bob',
      text: introMessage,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPromptIndex((current) => (current + 1) % promptWords.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const queueBobReply = (text: string) => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, { id: current.length + 1, role: 'bob', text }]);
      setIsTyping(false);
    }, 620);
  };

  const addTopicReply = (topic: Topic) => {
    setIsOpen(true);
    const label = topicOptions.find((option) => option.id === topic)?.label ?? 'Tell me more';
    setMessages((current) => [...current, { id: current.length + 1, role: 'user', text: label }]);
    queueBobReply(topicAnswers[topic]);
  };

  const submitMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((current) => [...current, { id: current.length + 1, role: 'user', text: trimmed }]);
    setInput('');
    queueBobReply(getBobReply(trimmed));
  };

  const resetChat = () => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setMessages([{ id: 1, role: 'bob', text: introMessage }]);
    setInput('');
  };

  return (
    <div className="bob-widget fixed bottom-4 left-3 z-[80] sm:bottom-6 sm:left-6">
      <div
        className={`absolute bottom-[154px] left-0 flex h-[min(620px,calc(100vh-11rem))] w-[min(calc(100vw-1.5rem),400px)] origin-bottom-left flex-col overflow-hidden overscroll-contain rounded-[22px] border border-white/10 bg-[#07070b]/95 shadow-2xl shadow-black/50 backdrop-blur-2xl transition-all duration-300 sm:bottom-[172px] ${
          isOpen ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-5 scale-95 opacity-0'
        }`}
        role="dialog"
        aria-label="Talk to Bob assistant"
      >
        <div className="relative border-b border-white/10 px-4 py-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-300"></div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-300/20">
                <Sparkles className={`h-4 w-4 ${isTyping ? 'animate-pulse' : ''}`} />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-sm font-bold text-white">Bob</h2>
                <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-gray-500">Aetas website assistant</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Reset Bob chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close Bob chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-4 py-4 [scrollbar-color:rgba(99,102,241,0.6)_rgba(255,255,255,0.06)] [scrollbar-width:thin]"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={`${message.id}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'bob' && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-300/20">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-white text-black shadow-white/5'
                      : 'rounded-bl-md border border-white/10 bg-white/[0.045] text-gray-300 shadow-black/20'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-300/20">
                  <Bot className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.045] px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/30 px-4 py-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {topicOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => addTopicReply(option.id)}
                disabled={isTyping}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-gray-300 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {option.icon}
                {option.short}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isTyping ? 'Bob is typing...' : 'Ask Bob about Aetas...'}
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:border-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-white transition-all hover:bg-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
              aria-label="Send message to Bob"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-3 grid grid-cols-1 gap-2">
            {suggestedQuestions.slice(0, 2).map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => submitMessage(question)}
                disabled={isTyping}
                className="rounded-xl border border-white/10 px-3 py-2 text-left text-[10px] text-gray-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>

          <a
            href="/contact"
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            <Building2 className="h-4 w-4" />
            Go to contact page
          </a>
        </div>
      </div>

      <div className="relative flex items-end gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="relative rounded-[26px] border border-white/10 bg-white/[0.035] px-2 pb-2 pt-3 shadow-2xl shadow-black/40 backdrop-blur-xl transition-colors hover:border-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
          aria-expanded={isOpen}
          aria-label="Talk to Bob"
        >
          <BobAvatar isTyping={isTyping} />
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`bob-prompt bob-speech mb-16 hidden max-w-[190px] rounded-2xl border border-white/10 bg-[#07070b]/95 px-4 py-3 text-left shadow-xl shadow-black/30 backdrop-blur-xl transition-all sm:block ${
            isOpen ? 'pointer-events-none opacity-0' : 'opacity-100 hover:border-indigo-400/30'
          }`}
        >
          <span key={promptWords[promptIndex]} className="bob-prompt-word inline-block max-w-full text-xs font-bold text-white">
            {promptWords[promptIndex]}
          </span>
          <span className="mt-1 block text-[10px] text-gray-500">Ask about Aetas services</span>
        </button>
      </div>

      <style>{`
        .bob-prompt {
          animation: bobFloat 4s ease-in-out infinite;
        }

        .bob-widget {
          view-transition-name: none;
        }

        .bob-speech {
          position: relative;
        }

        .bob-speech::before {
          content: "";
          position: absolute;
          left: -8px;
          bottom: 18px;
          width: 14px;
          height: 14px;
          transform: rotate(45deg);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: #07070b;
        }

        .bob-prompt-word {
          overflow: hidden;
          width: max-content;
          white-space: nowrap;
          border-right: 1px solid rgba(255, 255, 255, 0.8);
          animation: bobType 1.15s steps(22, end), bobCaret 0.7s step-end infinite;
        }

        .bob-thinking {
          animation: bobThink 0.9s ease-in-out infinite;
        }

        @keyframes bobFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes bobType {
          from { max-width: 0; }
          to { max-width: 190px; }
        }

        @keyframes bobCaret {
          0%, 100% { border-color: transparent; }
          50% { border-color: rgba(255, 255, 255, 0.8); }
        }

        @keyframes bobThink {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(34, 211, 238, 0)); }
          50% { filter: drop-shadow(0 0 14px rgba(34, 211, 238, 0.45)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bob-prompt,
          .bob-prompt-word,
          .bob-thinking {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
