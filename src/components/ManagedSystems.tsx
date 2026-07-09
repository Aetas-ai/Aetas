import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserCheck, Laptop, Inbox, Check } from 'lucide-react';

interface SystemCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tasks: string[];
}

const categories: SystemCategory[] = [
  {
    id: "identity",
    name: "Identity & Access Management",
    icon: UserCheck,
    description: "Configuring and maintaining secure access portals, directories, and user permissions across your organization.",
    tasks: [
      "User provisioning and account deactivation in M365 and Google Workspace",
      "Assigning product licenses and configuring cost-effective seat allocations",
      "Managing identity groups, security parameters, and roles inside Microsoft Entra ID",
      "Troubleshooting access lockouts and auditing directory sign-in logs",
      "Deploying and verifying Multi-Factor Authentication (MFA) parameters"
    ]
  },
  {
    id: "device",
    name: "Device Management & MDM",
    icon: Laptop,
    description: "Registering, auditing, and maintaining employee endpoints to comply with corporate security standards.",
    tasks: [
      "Enrolling corporate laptops and mobile devices in Microsoft Intune and JAMF MDM",
      "Configuring device compliance profiles and security baseline policies",
      "Executing remote device wipes and locking compromised endpoints",
      "Auditing active endpoint logs to verify operating system patches are current",
      "Deploying required software updates and configurations to fleet machines"
    ]
  },
  {
    id: "security",
    name: "Security Event Monitoring",
    icon: Shield,
    description: "Defending systems against modern threat vectors using built-in correlation and telemetry engines.",
    tasks: [
      "Monitoring active incident feeds in Microsoft Defender XDR",
      "Isolating compromised hosts and killing rogue processes via SentinelOne",
      "Triaging malicious email attempts and quarantine blocks in Abnormal Security",
      "Verifying secure edge access policies and network tunnels in Zscaler",
      "Running routine internal scans and parsing endpoint telemetry"
    ]
  },
  {
    id: "productivity",
    name: "Productivity & Tenant Upkeep",
    icon: Inbox,
    description: "Maintaining core communication tools, collaboration libraries, and cloud storage folders.",
    tasks: [
      "Managing Exchange Online transport rules, mailbox settings, and mail flow",
      "Configuring access permissions and document sharing limits in SharePoint & Google Drive",
      "Auditing tenant security configurations against recommended frameworks",
      "Running license pruning checks to identify and remove unused application seats",
      "Managing distribution lists and shared mailbox access profiles"
    ]
  }
];

export default function ManagedSystems() {
  const [activeTab, setActiveTab] = useState<string>("identity");

  const current = categories.find((c) => c.id === activeTab) || categories[0];
  const IconComponent = current.icon;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden border-white/5">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-sky-500 to-amber-500 opacity-60"></div>
      
      {/* Category Tabs Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-white/5 pb-6 mb-6">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex flex-col md:flex-row items-center gap-3 p-4 rounded-xl text-center md:text-left border transition-all ${
                activeTab === cat.id
                  ? 'bg-white/5 border-indigo-500/30 text-white shadow-lg'
                  : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10 hover:bg-black/10'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === cat.id ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-gray-500'}`}>
                <CatIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tracking-wide mt-2 md:mt-0 leading-tight">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Details Section */}
      <div className="min-h-[260px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Description Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <IconComponent className="w-6 h-6" />
                <h4 className="font-display font-bold text-white text-lg">{current.name}</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Task Checklist Column */}
            <div className="lg:col-span-7 bg-black/40 border border-white/5 p-5 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Operations & Config Tasks</span>
              <ul className="space-y-3">
                {current.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-gray-300 leading-relaxed">
                    <div className="w-4 h-4 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
