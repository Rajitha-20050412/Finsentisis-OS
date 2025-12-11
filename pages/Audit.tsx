import React from 'react';
import { PageContainer } from '../components/Shared';
import { mockAuditLogs } from '../services/dataService';
import { ShieldCheck, Download, FileText, CheckCircle2 } from 'lucide-react';

const Audit = () => {
  return (
    <PageContainer title="Immutable Audit Trail">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <div className="text-slate-400 text-sm mb-1">Blockchain Status</div>
                    <div className="text-green-400 font-semibold flex items-center"><CheckCircle2 size={16} className="mr-2"/> Anchored & Synced</div>
                </div>
                <ShieldCheck size={32} className="text-brand-500 opacity-50" />
           </div>
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <div className="text-slate-400 text-sm mb-1">Last Audit Export</div>
                    <div className="text-white font-semibold">Today, 09:00 AM</div>
                </div>
                <FileText size={32} className="text-blue-500 opacity-50" />
           </div>
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-center cursor-pointer hover:border-slate-600 transition-all group">
                <div className="flex items-center text-slate-300 group-hover:text-white font-medium">
                    <Download size={20} className="mr-2 group-hover:animate-bounce" />
                    Download Full Report (PDF)
                </div>
           </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
           <div className="p-6 border-b border-slate-800 flex justify-between items-center">
               <h3 className="text-lg font-semibold text-white">System Ledger</h3>
               <div className="text-xs font-mono text-slate-500">Block Height: #12,492,011</div>
           </div>
           <table className="w-full text-left text-sm">
               <thead className="bg-slate-950 text-slate-400 font-medium">
                   <tr>
                       <th className="p-4 pl-6">Timestamp</th>
                       <th className="p-4">Action</th>
                       <th className="p-4">User</th>
                       <th className="p-4">Immutable Hash</th>
                       <th className="p-4 pr-6 text-right">Verification</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                   {mockAuditLogs.map(log => (
                       <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                           <td className="p-4 pl-6 font-mono text-slate-500 text-xs">{log.timestamp}</td>
                           <td className="p-4 text-slate-200">{log.action}</td>
                           <td className="p-4 text-slate-400">{log.user}</td>
                           <td className="p-4">
                               <code className="bg-slate-950 px-2 py-1 rounded text-xs text-brand-400 font-mono border border-slate-800">
                                   {log.hash}
                               </code>
                           </td>
                           <td className="p-4 pr-6 text-right">
                               <span className="inline-flex items-center text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs border border-green-500/20">
                                   <CheckCircle2 size={10} className="mr-1"/> Verified
                               </span>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </PageContainer>
  );
};

export default Audit;