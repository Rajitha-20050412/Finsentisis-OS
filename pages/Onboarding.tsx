
import React, { useState } from 'react';
import { Building2, Globe2, CheckCircle2, ChevronRight, Factory, Landmark, Stethoscope, ShoppingCart, Zap, Database, Scale } from 'lucide-react';
import { cn } from '../utils';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const SECTORS = [
  { id: 'finance', name: 'Finance & Banking', icon: Landmark },
  { id: 'health', name: 'Healthcare & Pharma', icon: Stethoscope },
  { id: 'mfg', name: 'Manufacturing', icon: Factory },
  { id: 'tech', name: 'Technology & SaaS', icon: Database },
  { id: 'retail', name: 'Retail & E-commerce', icon: ShoppingCart },
  { id: 'energy', name: 'Energy & Utilities', icon: Zap },
];

const REGIONS = [
  { id: 'na', name: 'North America', detail: 'USA, Canada, Mexico' },
  { id: 'eu', name: 'Europe (EMEA)', detail: 'EU, UK, Switzerland' },
  { id: 'apac', name: 'Asia Pacific', detail: 'India, Singapore, Japan, Aus' },
  { id: 'latam', name: 'Latin America', detail: 'Brazil, Argentina' },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [companyName, setCompanyName] = useState('');
  const [employees, setEmployees] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    // Simulate setup delay
    setTimeout(() => {
      onComplete({
          companyName,
          employees,
          regions: selectedRegions,
          sector: selectedSector
      });
    }, 2500);
  };

  const toggleRegion = (id: string) => {
    setSelectedRegions(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-10">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
            step === i ? "bg-brand-500 text-white ring-4 ring-brand-500/20" : 
            step > i ? "bg-green-500 text-white" : "bg-slate-800 text-slate-500"
          )}>
            {step > i ? <CheckCircle2 size={16} /> : i}
          </div>
          {i < 3 && <div className={cn("w-12 h-1 bg-slate-800 mx-2 rounded", step > i && "bg-green-500")} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-900/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-900/10 blur-[100px] pointer-events-none" />

      {isProcessing ? (
        <div className="text-center animate-in fade-in duration-700">
           <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <Scale size={32} className="text-brand-500" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Configuring Finsentsis OS</h2>
           <p className="text-slate-400">Loading regulatory frameworks for {selectedSector}...</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 lg:p-12 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {step === 1 && "Setup Organization Profile"}
              {step === 2 && "Operational Geography"}
              {step === 3 && "Industry Sector"}
            </h2>
            <p className="text-slate-400">
              {step === 1 && "Tell us about your company to customize your workspace."}
              {step === 2 && "Select the regions where your entity operates to load relevant laws."}
              {step === 3 && "We'll tailor compliance risk models based on your industry."}
            </p>
          </div>

          {renderStepIndicator()}

          <div className="min-h-[300px]">
            {/* STEP 1: Company Profile */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                      placeholder="e.g. Acme Corp"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Company Size</label>
                  <select 
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all appearance-none"
                  >
                    <option value="" disabled>Select employee count</option>
                    <option value="1-50">1 - 50 Employees</option>
                    <option value="51-200">51 - 200 Employees</option>
                    <option value="201-1000">201 - 1,000 Employees</option>
                    <option value="1000+">1,000+ Employees</option>
                  </select>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                   <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Plan</div>
                      <div className="text-brand-400 font-semibold">Enterprise Global</div>
                   </div>
                   <div className="bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full text-xs font-medium border border-brand-500/20">
                       verified
                   </div>
                </div>
              </div>
            )}

            {/* STEP 2: Regions */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-8 duration-300">
                {REGIONS.map(region => (
                  <div 
                    key={region.id}
                    onClick={() => toggleRegion(region.id)}
                    className={cn(
                      "p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-32 relative overflow-hidden group",
                      selectedRegions.includes(region.id) 
                        ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800"
                    )}
                  >
                    <div className="flex justify-between items-start z-10">
                       <Globe2 size={24} className={selectedRegions.includes(region.id) ? "text-white" : "text-slate-600 group-hover:text-slate-400"} />
                       {selectedRegions.includes(region.id) && <CheckCircle2 size={20} className="text-white" />}
                    </div>
                    <div className="z-10">
                       <h3 className={cn("font-bold text-lg", selectedRegions.includes(region.id) ? "text-white" : "text-slate-200")}>{region.name}</h3>
                       <p className={cn("text-xs mt-1", selectedRegions.includes(region.id) ? "text-brand-100" : "text-slate-500")}>{region.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: Sector */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-8 duration-300">
                 {SECTORS.map(sector => {
                   const Icon = sector.icon;
                   const isSelected = selectedSector === sector.id;
                   return (
                     <div 
                        key={sector.id}
                        onClick={() => setSelectedSector(sector.id)}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-4",
                          isSelected
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                        )}
                     >
                        <div className={cn("p-2 rounded-lg", isSelected ? "bg-white/20" : "bg-slate-800")}>
                           <Icon size={20} className={isSelected ? "text-white" : "text-slate-400"} />
                        </div>
                        <span className={cn("font-medium text-sm", isSelected ? "text-white" : "text-slate-300")}>
                          {sector.name}
                        </span>
                     </div>
                   );
                 })}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center border-t border-slate-800 pt-6">
             {step > 1 ? (
               <button 
                  onClick={() => setStep(prev => prev - 1)}
                  className="text-slate-500 hover:text-white text-sm font-medium px-4 py-2"
                >
                  Back
               </button>
             ) : (
               <div /> // Spacer
             )}

             <button 
               onClick={handleNext}
               disabled={(step === 1 && !companyName) || (step === 2 && selectedRegions.length === 0) || (step === 3 && !selectedSector)}
               className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold flex items-center transition-all shadow-lg shadow-brand-500/20"
             >
               {step === 3 ? "Complete Setup" : "Continue"}
               <ChevronRight size={18} className="ml-2" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
