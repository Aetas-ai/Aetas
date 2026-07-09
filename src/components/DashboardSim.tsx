import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, ShieldAlert, Cpu, CheckCircle2, UserCheck, Terminal, Layers } from 'lucide-react';

const mockData = [
  { name: '08:00', alerts: 12, resolved: 8 },
  { name: '10:00', alerts: 18, resolved: 15 },
  { name: '12:00', alerts: 24, resolved: 22 },
  { name: '14:00', alerts: 15, resolved: 15 },
  { name: '16:00', alerts: 30, resolved: 28 },
  { name: '18:00', alerts: 10, resolved: 9 },
];

interface LogEntry {
  time: string;
  type: 'info' | 'alert' | 'success' | 'ai';
  message: string;
}

export default function DashboardSim() {
  const [activeTab, setActiveTab] = useState<'security' | 'helpdesk' | 'ai'>('security');
  const [simStep, setSimStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [timeSaved, setTimeSaved] = useState(148.5);
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '10:40:12', type: 'info', message: 'SOC Monitoring active. Streaming Defender XDR and SentinelOne log channels.' },
    { time: '10:41:05', type: 'info', message: 'Client MSP helpdesk queues active (routed per tenant preferences).' },
    { time: '10:42:30', type: 'success', message: 'Weekly patch deployment verified across enrolled tenant devices.' },
  ]);

  const addLog = (message: string, type: 'info' | 'alert' | 'success' | 'ai') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [{ time, type, message }, ...prev.slice(0, 7)]);
  };

  const runSimulation = () => {
    if (simStep > 0) return; // Prevent double running

    // Step 1: Alert Ingest
    setSimStep(1);
    const eventMsg = activeTab === 'security'
      ? 'SECURITY ALERT: Microsoft Defender XDR flagged anomalous credential behavior.'
      : activeTab === 'helpdesk'
      ? 'TICKET INGEST: Support request received for user access lockout (routed to tenant system).'
      : 'PILOT INGEST: Experimental BPO workflow data payload received for mapping.';
    addLog(eventMsg, 'alert');

    // Step 2: Product built-in AI / Auto Correlation (1.5s later)
    setTimeout(() => {
      setSimStep(2);
      const triageMsg = activeTab === 'security'
        ? 'Product Native AI: Defender XDR automated investigation correlated alerts. Suggested remediation steps.'
        : activeTab === 'helpdesk'
        ? 'System Triage: Active Directory / Identity check flagged consecutive failed validation checks.'
        : 'Roadmap Pilot AI: Sandbox parse testing metadata extraction & route mapping drafts (AI Roadmap Pilot).';
      addLog(triageMsg, 'ai');
    }, 1500);

    // Step 3: Human Expert Validation (3s later)
    setTimeout(() => {
      setSimStep(3);
      const humanMsg = activeTab === 'security'
        ? 'Human Validation: Aetas Security Analyst verified incident context and approved isolation protocol.'
        : activeTab === 'helpdesk'
        ? 'Human Validation: IT Support Specialist audited sign-in logs and confirmed user status.'
        : 'Human Validation: Operations Lead reviews pilot automation schema suggestions.';
      addLog(humanMsg, 'info');
    }, 3200);

    // Step 4: Resolution (4.8s later)
    setTimeout(() => {
      setSimStep(4);
      const resolutionMsg = activeTab === 'security'
        ? 'RESOLVED: Endpoint isolated via Defender XDR rules. Threat contained.'
        : activeTab === 'helpdesk'
        ? 'RESOLVED: Access restored and synchronization verified in client workspace.'
        : 'RESOLVED: Sandbox data mapping completed. Pilot log logs updated.';
      addLog(resolutionMsg, 'success');
      
      const addedTime = activeTab === 'security' ? 35 : activeTab === 'helpdesk' ? 15 : 45;
      setTimeSaved((prev) => parseFloat((prev + addedTime / 60).toFixed(1)));
    }, 4800);

    // Reset back to idle (8s later)
    setTimeout(() => {
      setSimStep(0);
    }, 8000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 glass-panel rounded-2xl p-6 lg:p-8 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 opacity-60"></div>
      
      {/* Console Side Controls */}
      <div className="lg:col-span-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-8">
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-2">Operational Dashboard</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Compare our service disciplines. Trigger a simulation to see the Aetas workflow loop in action.
          </p>

          <div className="flex flex-col gap-2.5 mb-8">
            <button
              onClick={() => { setActiveTab('security'); setSimStep(0); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border ${
                activeTab === 'security'
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-white/2 border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <div className="text-xs">
                <p className="font-semibold">Security MSSP (SOC)</p>
                <p className="opacity-80">Offensive & Defensive SOC</p>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('helpdesk'); setSimStep(0); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border ${
                activeTab === 'helpdesk'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-white/2 border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <div className="text-xs">
                <p className="font-semibold">Global MSP (IT Support)</p>
                <p className="opacity-80">Flexible support for tenant-chosen tools</p>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('ai'); setSimStep(0); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border ${
                activeTab === 'ai'
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-white/2 border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <div className="text-xs">
                <p className="font-semibold">Aetas AI Agent (Roadmap)</p>
                <p className="opacity-80">Workflow automation model</p>
              </div>
            </button>
          </div>
        </div>

        <div>
          {/* Cumulative Saved Timer */}
          <div className="bg-white/2 border border-white/5 p-4 rounded-xl mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Total Simulation Savings</p>
              <p className="text-2xl font-bold font-display text-white mt-1">{timeSaved} <span className="text-xs font-normal text-gray-400">Hours</span></p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={simStep > 0}
            className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              simStep > 0
                ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                : activeTab === 'security'
                ? 'bg-sky-500 hover:bg-sky-600 border-sky-400/20 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98]'
                : activeTab === 'helpdesk'
                ? 'bg-amber-500 hover:bg-amber-600 border-amber-400/20 text-white shadow-lg shadow-amber-500/20 active:scale-[0.98]'
                : 'bg-indigo-500 hover:bg-indigo-600 border-indigo-400/20 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>SIMULATE EVENT FLOW</span>
          </button>
        </div>
      </div>

      {/* Visual Workspace & Logs */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Graph representation */}
        <div className="h-44 w-full bg-black/40 border border-white/5 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Metrics Monitoring</span>
            <div className="flex gap-4 text-[10px]">
              <span className="flex items-center gap-1.5 text-gray-300"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Alerts</span>
              <span className="flex items-center gap-1.5 text-gray-300"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Resolved</span>
            </div>
          </div>
          <div className="w-full h-32 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#555" fontSize={9} />
                <YAxis stroke="#555" fontSize={9} width={15} />
                <Tooltip contentStyle={{ backgroundColor: '#050508', border: '1px solid rgba(255,255,255,0.05)' }} />
                <Area type="monotone" dataKey="alerts" stroke="#6366f1" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Event Pipeline */}
        <div className="grid grid-cols-4 gap-2 text-center items-center py-4 bg-black/20 border border-white/5 rounded-xl px-2 relative min-h-24">
          {/* Step 1 */}
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${simStep >= 1 ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
            <div className={`p-2.5 rounded-full border ${simStep === 1 ? 'animate-pulse bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">1. Event</span>
          </div>

          {/* Step 2 */}
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${simStep >= 2 ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
            <div className={`p-2.5 rounded-full border ${simStep === 2 ? 'animate-pulse bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">2. AI Triage</span>
          </div>

          {/* Step 3 */}
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${simStep >= 3 ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
            <div className={`p-2.5 rounded-full border ${simStep === 3 ? 'animate-pulse bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">3. Human Loop</span>
          </div>

          {/* Step 4 */}
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${simStep >= 4 ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
            <div className={`p-2.5 rounded-full border ${simStep === 4 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">4. Resolved</span>
          </div>
        </div>

        {/* Live Terminal logs */}
        <div className="flex-grow bg-black/80 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-gray-300 overflow-hidden flex flex-col justify-start">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3 text-gray-500 select-none">
            <Terminal className="w-3.5 h-3.5" />
            <span>SYSTEM CONSOLE LOGS</span>
          </div>
          <div className="space-y-2 flex-grow overflow-y-auto max-h-[120px] scrollbar-thin">
            <AnimatePresence>
              {logs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-gray-600 shrink-0">[{log.time}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 uppercase tracking-widest ${
                    log.type === 'alert' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    log.type === 'ai' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-white/5 text-gray-400 border border-white/5'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-300 break-words leading-relaxed">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
