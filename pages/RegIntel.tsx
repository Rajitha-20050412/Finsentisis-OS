
import React, { useState } from 'react';
import { PageContainer } from '../components/Shared';
import { getFilteredData } from '../services/dataService';
import { RiskLevel, Regulation, UserProfile } from '../types';
import { Search, Filter, BookOpen, AlertCircle, ChevronRight, Share2, PlusCircle } from 'lucide-react';
import { cn } from '../utils';

interface RegulationCardProps {
  reg: Regulation;
  onClick: () => void;
}

const RegulationCard: React.FC<RegulationCardProps> = ({ reg, onClick }) => (
  <div onClick={onClick} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5 transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-2">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
          reg.riskLevel === RiskLevel.CRITICAL ? "bg-red-500/10 text-red-400 border border-red-500/20" :
          reg.riskLevel === RiskLevel.HIGH ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        )}>
          {reg.riskLevel}
        </span>
        <span className="text-xs text-slate-500">{reg.region}</span>
      </div>
      <span className="text-xs text-slate-500 font-mono">{reg.lastUpdated}</span>
    </div>
    <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-brand-400 transition-colors">{reg.title}</h3>
    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{reg.summary}</p>
    <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3 mt-auto">
        <span className="text-slate-500 flex items-center">
            <BookOpen size={12} className="mr-1" />
            Source Verified
        </span>
        <span className="flex items-center text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Analyze Impact <ChevronRight size={12} className="ml-1" />
        </span>
    </div>
  </div>
);

interface RegIntelProps {
    userProfile: UserProfile | null;
}

const RegIntel: React.FC<RegIntelProps> = ({ userProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState<Regulation | null>(null);

  // Get data filtered by user profile first
  const { regulations: relevantRegs } = getFilteredData(userProfile);

  // Then apply search term
  const filteredRegs = relevantRegs.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="Regulatory Intelligence">
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        <div className="mb-8 flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Search global laws, statutes, and mandates..."
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
          {/* Results List */}
          <div className={cn("overflow-y-auto pr-2 space-y-4 custom-scrollbar", selectedReg ? "col-span-5" : "col-span-12")}>
             {filteredRegs.length > 0 ? filteredRegs.map(reg => (
               <RegulationCard key={reg.id} reg={reg} onClick={() => setSelectedReg(reg)} />
             )) : (
                 <div className="text-center text-slate-500 mt-10 p-10 border border-dashed border-slate-800 rounded-xl">
                     No regulations found matching your criteria.
                 </div>
             )}
          </div>

          {/* Details Pane */}
          {selectedReg && (
            <div className="col-span-7 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right-10 duration-300">
               <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/30">
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedReg.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-2" />{selectedReg.region}</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-2" />ID: {selectedReg.id}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedReg(null)} className="text-slate-500 hover:text-white">Close</button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="flex items-center text-blue-400 font-semibold mb-2">
                          <AlertCircle size={16} className="mr-2" /> 
                          AI Impact Analysis ({userProfile?.sector || 'General'})
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                          {selectedReg.impact}
                          <br/><br/>
                          <span className="text-slate-500 italic">Confidence Score: 98% (Verified against Official Gazette)</span>
                      </p>
                  </div>

                  <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Plain English Summary</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                          {selectedReg.summary} This regulation introduces strict requirements for transparency and accountability. 
                          Key obligations include maintaining technical documentation, conducting conformity assessments, and ensuring human oversight.
                          Non-compliance can result in fines up to 6% of global turnover.
                      </p>
                  </div>

                  <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Key Obligations Extracted</h3>
                      <ul className="space-y-3">
                          {[
                              "Establish a risk management system.",
                              "Conduct data governance and management practices.",
                              "Create technical documentation before market placement.",
                              "Maintain automatic record-keeping (logs)."
                          ].map((item, idx) => (
                              <li key={idx} className="flex items-start group">
                                  <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-brand-500 mr-3" />
                                  <span className="text-slate-300 text-sm flex-1">{item}</span>
                                  <button className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-slate-800 rounded text-brand-400 text-xs flex items-center">
                                      <PlusCircle size={12} className="mr-1"/> Create Task
                                  </button>
                              </li>
                          ))}
                      </ul>
                  </div>
               </div>
               
               <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end space-x-3">
                    <button className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 font-medium flex items-center">
                        <Share2 size={16} className="mr-2" /> Share
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 flex items-center shadow-lg shadow-brand-500/20">
                        <PlusCircle size={16} className="mr-2" /> Create Policy Workflow
                    </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default RegIntel;
