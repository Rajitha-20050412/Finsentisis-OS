import React from 'react';
import { PageContainer } from '../components/Shared';
import { mockPolicies } from '../services/dataService';
import { FileText, GitBranch, Share2, Plus } from 'lucide-react';

const Policy = () => {
  return (
    <PageContainer title="Policy to Process Studio">
       <div className="flex flex-col h-full">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               <button className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-dashed border-slate-700 rounded-xl hover:bg-slate-800 hover:border-brand-500 hover:text-brand-400 text-slate-500 transition-all group">
                   <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-brand-500/20">
                       <Plus size={24} />
                   </div>
                   <span className="font-medium">Create New Policy</span>
               </button>
               {mockPolicies.map(pol => (
                   <div key={pol.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all cursor-pointer relative group overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <FileText size={80} />
                       </div>
                       <div className="relative z-10">
                           <div className="flex justify-between items-start mb-2">
                               <span className="text-xs font-mono text-slate-500">{pol.id}</span>
                               <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${pol.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                   {pol.status}
                               </span>
                           </div>
                           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-400">{pol.name}</h3>
                           <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{pol.description}</p>
                           
                           <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                               <div className="text-xs text-slate-500">
                                   <span className="block text-slate-400">Owner</span>
                                   {pol.owner}
                               </div>
                               <div className="flex space-x-2">
                                   <button className="p-2 bg-slate-800 rounded hover:text-white text-slate-400" title="View Map">
                                       <GitBranch size={16} />
                                   </button>
                                   <button className="p-2 bg-slate-800 rounded hover:text-white text-slate-400" title="Share">
                                       <Share2 size={16} />
                                   </button>
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
           
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center min-h-[300px] text-center">
               <div className="max-w-md">
                   <GitBranch size={48} className="mx-auto text-brand-500 mb-4 opacity-80" />
                   <h3 className="text-xl font-semibold text-white mb-2">Policy Mapping Visualization</h3>
                   <p className="text-slate-400 text-sm">Select a policy above to visualize how regulations map to internal controls and automated workflows.</p>
               </div>
           </div>
       </div>
    </PageContainer>
  );
};

export default Policy;