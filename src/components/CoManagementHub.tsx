import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, HelpCircle, ArrowRightLeft, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  clientStep: string;
  hubStep: string;
  aetasStep: string;
}

const scenarios: Scenario[] = [
  {
    id: "security-escalation",
    title: "24/7 SOC Threat Containment",
    description: "How we coordinate incident response when Defender XDR flags a critical anomaly.",
    clientStep: "Client SecOps receives automatic notification in Microsoft Defender portal.",
    hubStep: "Threat feeds stream to Aetas SOC. Auto-correlation rules verify host telemetry.",
    aetasStep: "Aetas analysts isolate host, execute containment scripts, and notify Client lead via dedicated Slack channel."
  },
  {
    id: "helpdesk-overflow",
    title: "Helpdesk Overflow & Escalations",
    description: "Seamless handover when internal client IT support gets overloaded or encounters complex system blockers.",
    clientStep: "Client IT team flags tickets requiring specialized infrastructure support.",
    hubStep: "API connectors sync the ticket state from Client ITSM portal to Aetas Global queues.",
    aetasStep: "Aetas systems engineers audit Entra/Azure logs, apply fixes, and resolve ticket in client's portal."
  },
  {
    id: "license-audit",
    title: "License Optimization & Governance",
    description: "Proactive tenant reviews to eliminate inactive subscriptions and scale resources.",
    clientStep: "Client finance team requests subscription cost containment audits.",
    hubStep: "Aetas systems scan tenant license registries and compute utilization statistics.",
    aetasStep: "Aetas administrators deliver configuration recommendations, pruning unused accounts to save budget."
  }
];

export default function CoManagementHub() {
  const [activeScenario, setActiveScenario] = useState<string>("security-escalation");

  const current = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

  return (
    <div className="w-full glass-panel rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden border-indigo-500/10">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 opacity-60"></div>
      
      {/* Header and Scenario Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8 mb-8">
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-2">Unified Co-Management Hub</h3>
          <p className="text-gray-400 text-xs max-w-md">
            We act as a seamless extension of your internal IT and security departments, sharing systems, logs, and channels.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => setActiveScenario(scen.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                activeScenario === scen.id
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-md'
                  : 'bg-white/2 border-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              {scen.title}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Coordination Map */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center min-h-[300px]">
        
        {/* Left: Client Enterprise */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl border-white/5 text-center flex flex-col justify-between h-full min-h-[220px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-gray-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-white text-sm">Client IT/Security Team</h4>
            <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-wider">Tenant Owners</p>
          </div>
          <div className="bg-black/20 border border-white/5 p-4 rounded-xl mt-4">
            <span className="text-[9px] font-bold text-sky-400 uppercase block mb-1">Active Scenario Step</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScenario}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[11px] text-gray-300 leading-relaxed"
              >
                {current.clientStep}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Connectors Hub */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 animate-spin-slow">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-white text-sm mb-2">Integration Channels</h4>
          <p className="text-gray-400 text-xs max-w-xs mb-4">
            Unified via API tokens, Microsoft Defender XDR incident feeds, and collaborative Slack/Teams bridges.
          </p>
          
          <div className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-left font-mono text-[10px] text-gray-400 min-h-[90px]">
            <span className="text-gray-600 block border-b border-white/5 pb-1 mb-2 select-none">// SYNC STATUS LOG</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScenario}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-300 leading-relaxed"
              >
                {current.hubStep}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Aetas Operations */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl border-white/5 text-center flex flex-col justify-between h-full min-h-[220px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-white text-sm">Aetas Specialists</h4>
            <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-wider">24/7 Extension Team</p>
          </div>
          <div className="bg-black/20 border border-white/5 p-4 rounded-xl mt-4">
            <span className="text-[9px] font-bold text-indigo-400 uppercase block mb-1">Aetas Execution Step</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScenario}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[11px] text-gray-300 leading-relaxed"
              >
                {current.aetasStep}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
