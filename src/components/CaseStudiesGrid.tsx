import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Brain, Users, ArrowUpRight, CheckCircle } from 'lucide-react';

interface CaseStudy {
  slug: string;
  pillar: 'security' | 'global' | 'ai';
  title: string;
  metric: string;
  metricLabel: string;
  capability: string;
  before: string;
  process: string;
  after: string;
  tech: string[];
}

const caseStudies: CaseStudy[] = [
  {
    slug: "fintech-security-compliance",
    pillar: "security",
    title: "Enterprise Penetration Testing & Compliance Readiness",
    metric: "100%",
    metricLabel: "Compliance audit readiness achieved in 45 days",
    capability: "Pentest & Compliance",
    before: "Siloed local infrastructure with zero visibility into APIs and compliance gaps, putting customer contracts at risk.",
    process: "Conducted deep API, web-app and external network pentesting. Drafted vulnerability remediation plans and connected security compliance frameworks.",
    after: "Full penetration test signoff, remediation validation, and successful regulatory audit verification without exception.",
    tech: ["Qualys", "Vulcan Cyber", "Abnormal Security", "Zscaler"]
  },
  {
    slug: "healthcare-mdr-soc",
    pillar: "security",
    title: "Always-on SOC & Incident Response",
    metric: "4 mins",
    metricLabel: "Average threat detection to containment",
    capability: "MDR / SOC",
    before: "Internal IT staff managing firewalls during standard business hours only, leaving the network vulnerable to overnight exploits.",
    process: "Deployed Aetas 24/7 MSSP SOC monitoring using SentinelOne agent infrastructure and integrated alert triaging.",
    after: "Continuous detection coverage. Stopped a major ransomware deployment at 2:00 AM within 4 minutes of execution signature.",
    tech: ["SentinelOne", "Microsoft Defender", "SOC Platform", "Zscaler"]
  },
  {
    slug: "global-msp-helpdesk-scaling",
    pillar: "global",
    title: "M365 & Entra ID Enterprise Helpdesk Scaling",
    metric: "98.7%",
    metricLabel: "SLA compliance on 12,000+ monthly tickets",
    capability: "Helpdesk & M365",
    before: "Users experiencing 24-hour delays for M365 license assignments, user provisioning, security group changes, and device enrollment.",
    process: "Deployed a dedicated Aetas Global Helpdesk team using Microsoft 365 Admin Center, Entra ID role assignments, and Intune policies for device enrollment.",
    after: "Resolved Entra ID lockouts, Exchange profiles, and MFA setups in <15 minutes by auditing Entra sign-in and audit logs.",
    tech: ["M365 Admin Center", "Microsoft Entra ID", "Microsoft Intune", "Exchange", "SharePoint"]
  },
  {
    slug: "bpo-customer-support-operations",
    pillar: "global",
    title: "Always-on Outsourced Product Support Desk",
    metric: "3.2x",
    metricLabel: "Increase in call & chat queue throughput",
    capability: "BPO",
    before: "Rapid product adoption outpaced support capacity, leading to dropped calls and high customer churn.",
    process: "Integrated structured customer support teams under Aetas Global operational protocols, structuring training guides and escalations.",
    after: "Stabilized response times under 2 minutes globally. 3.2x support capacity increase at 40% lower cost.",
    tech: ["Genesys Cloud", "Zendesk", "Slack Enterprise"]
  },
  {
    slug: "workflow-automation-pilot",
    pillar: "ai",
    title: "AI-Augmented Helpdesk Automation Pilot",
    metric: "35%",
    metricLabel: "Reduction in average ticket handling time (AHT)",
    capability: "Workflow Automation",
    before: "Agents manually triaging, reading documentation, and drafting standard replies for recurring support tickets.",
    process: "Roadmap implementation testing in an isolated sandbox, evaluating a custom LLM copilot that digests static documentation to auto-draft replies for human review.",
    after: "Validated baseline accuracy in internal test environments. (Pilot stage only; not deployed in production client tenants).",
    tech: ["Anthropic Claude", "Private LLM Vector", "Sandbox Environment"]
  }
];

export default function CaseStudiesGrid() {
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'security' | 'global' | 'ai'>('all');

  const filteredStudies = caseStudies.filter(
    (study) => selectedPillar === 'all' || study.pillar === selectedPillar
  );

  return (
    <div className="w-full">
      {/* Category Filter Controls */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <button
          onClick={() => setSelectedPillar('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all ${
            selectedPillar === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-white/2 border-white/5 text-gray-400 hover:border-white/20'
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setSelectedPillar('security')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${
            selectedPillar === 'security'
              ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
              : 'bg-white/2 border-white/5 text-gray-400 hover:border-white/20'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Security (MSSP)
        </button>
        <button
          onClick={() => setSelectedPillar('global')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${
            selectedPillar === 'global'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
              : 'bg-white/2 border-white/5 text-gray-400 hover:border-white/20'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Global (MSP)
        </button>
        <button
          onClick={() => setSelectedPillar('ai')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${
            selectedPillar === 'ai'
              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
              : 'bg-white/2 border-white/5 text-gray-400 hover:border-white/20'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Aetas AI (Roadmap)
        </button>
      </div>

      {/* Grid Display */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              key={study.slug}
              className="glass-panel glass-panel-hover rounded-2xl p-6 lg:p-8 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-6">
                  {/* Category Pill */}
                  <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    study.pillar === 'security' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                    study.pillar === 'global' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {study.capability}
                  </span>

                  {/* Icon */}
                  <div className="text-gray-500 group-hover:text-white transition-colors">
                    {study.pillar === 'security' && <Shield className="w-5 h-5" />}
                    {study.pillar === 'global' && <Users className="w-5 h-5" />}
                    {study.pillar === 'ai' && <Brain className="w-5 h-5" />}
                  </div>
                </div>

                {/* Big Metric Section */}
                <div className="mb-6">
                  <span className="text-4xl lg:text-5xl font-display font-bold text-white block mb-1">
                    {study.metric}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {study.metricLabel}
                  </span>
                </div>

                <h4 className="text-xl font-display font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                  {study.title}
                </h4>

                {/* Before / Process / After Flow */}
                <div className="space-y-3 mb-6 text-xs leading-relaxed border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-0.5">Before</span>
                    <p className="text-gray-400">{study.before}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Execution Process</span>
                    <p className="text-gray-300">{study.process}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">Result</span>
                    <p className="text-white font-medium flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{study.after}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Technologies used */}
              <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                {study.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
