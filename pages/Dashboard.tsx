
import React from 'react';
import { PageContainer } from '../components/Shared';
import WorldMap from '../components/WorldMap';
import { countryRiskData, getFilteredData } from '../services/dataService';
import { UserProfile } from '../types';
import { AlertTriangle, Clock, FileWarning, TrendingUp, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import { formatCurrency } from '../utils';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const KPICard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon size={64} />
    </div>
    <div className="flex flex-col relative z-10">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`p-2 rounded-lg bg-slate-800 ${colorClass}`}>
          <Icon size={20} />
        </div>
        <span className="text-slate-400 font-medium text-sm">{title}</span>
      </div>
      <span className="text-2xl font-bold text-white mb-1">{value}</span>
      <span className="text-xs text-slate-500">{subtext}</span>
    </div>
  </div>
);

const RiskTrendChart = () => {
    const data = [
      { name: 'Jan', risk: 40 },
      { name: 'Feb', risk: 35 },
      { name: 'Mar', risk: 50 }, // New regulation
      { name: 'Apr', risk: 45 },
      { name: 'May', risk: 30 },
      { name: 'Jun', risk: 25 },
    ];
    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: '#334155', opacity: 0.4}}
                    />
                    <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.risk > 40 ? '#ef4444' : '#22c55e'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

interface DashboardProps {
    userProfile: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const { tasks: relevantTasks, regulations: relevantRegs } = getFilteredData(userProfile);
  
  // Calculate dynamic KPIs based on filtered data
  const criticalIssues = relevantTasks.filter(t => t.priority === 'Critical' && t.status !== 'Done').length;
  const highIssues = relevantTasks.filter(t => t.priority === 'High' && t.status !== 'Done').length;
  const totalOpen = criticalIssues + highIssues;
  
  // Simulated penalty calculation based on sector
  const basePenalty = 1500000;
  const sectorMultiplier = userProfile?.sector === 'finance' ? 2.5 : userProfile?.sector === 'health' ? 1.8 : 1.2;
  const estimatedFine = basePenalty * sectorMultiplier;

  // Filter alerts based on relevant regulations
  const alerts = [
      { title: "New Regulation Detected: EU AI Act Finalized", time: "2h ago", type: "Critical", desc: "Requires impact assessment for all deployed ML models.", regId: 'REG-001' },
      { title: "India DPDP Act: Compliance Deadline Approaching", time: "5h ago", type: "High", desc: "Consent manager integration must be completed by Q3.", regId: 'REG-002' },
      { title: "Tax Filing: GST Return Mismatch", time: "1d ago", type: "Medium", desc: "Discrepancy found in Phase 6 e-invoicing data.", regId: 'REG-005' },
      { title: "HIPAA Security Rule Update", time: "3d ago", type: "Critical", desc: "New encryption standards for PHI data.", regId: 'REG-006' }
  ].filter(alert => {
      // Find if this alert's regulation is in the user's relevant regulations
      return relevantRegs.find(r => r.id === alert.regId);
  });

  return (
    <PageContainer title="Global Risk Dashboard">
      {userProfile && (
          <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
              <h2 className="text-xl font-bold text-white flex items-center">
                  <Building2 className="mr-3 text-brand-500" size={24} />
                  Welcome back, {userProfile.companyName} Team
              </h2>
              <p className="text-slate-400 text-sm mt-1 ml-9">
                  Monitoring compliance for <span className="text-white font-medium">{userProfile.sector}</span> sector across <span className="text-white font-medium">{userProfile.regions.length} regions</span>.
              </p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Overall Risk Score" 
          value="72/100" 
          subtext="+5% from last month (Improving)" 
          icon={TrendingUp} 
          colorClass="text-yellow-500" 
        />
        <KPICard 
          title="Open Critical Issues" 
          value={totalOpen.toString()} 
          subtext={`${criticalIssues} critical items requiring attention`} 
          icon={AlertTriangle} 
          colorClass="text-red-500" 
        />
        <KPICard 
          title="Upcoming Deadlines" 
          value={relevantTasks.length.toString()} 
          subtext="Total active remediation tasks" 
          icon={Clock} 
          colorClass="text-blue-500" 
        />
        <KPICard 
          title="Penalty Exposure" 
          value={formatCurrency(estimatedFine)} 
          subtext="Estimated max potential fines" 
          icon={FileWarning} 
          colorClass="text-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
            <WorldMap data={countryRiskData} />
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Compliance Alert Feed ({alerts.length})</h3>
                    <button className="text-xs text-brand-400 hover:text-brand-300">View All</button>
                </div>
                <div className="space-y-4">
                    {alerts.length > 0 ? alerts.map((alert, i) => (
                        <div key={i} className="flex items-start p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-800/50 hover:border-slate-700">
                            <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${alert.type === 'Critical' ? 'bg-red-500' : alert.type === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-slate-200">{alert.title}</span>
                                    <span className="text-xs text-slate-500">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-400">{alert.desc}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-4 text-center text-slate-500 text-sm">No new alerts for your current configuration.</div>
                    )}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Trend (6 Months)</h3>
                <RiskTrendChart />
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-400">Risk score analyzing {userProfile ? userProfile.regions.join(', ').toUpperCase() : 'GLOBAL'} markets.</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Priority Actions</h3>
                <div className="space-y-3">
                    {relevantTasks.slice(0,3).map((task) => (
                        <div key={task.id} className="group flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-brand-500/50 transition-all cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <div className={`p-1.5 rounded-full bg-slate-800 ${task.priority === 'Critical' ? 'text-red-500' : 'text-blue-500'}`}>
                                    {task.status === 'Done' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-200 group-hover:text-brand-400 transition-colors line-clamp-1">{task.title}</div>
                                    <div className="text-xs text-slate-500">Due: {task.dueDate}</div>
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-600 group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                    {relevantTasks.length === 0 && (
                         <div className="p-4 text-center text-slate-500 text-sm">No priority tasks found.</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
