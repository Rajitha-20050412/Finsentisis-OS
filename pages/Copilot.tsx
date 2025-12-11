
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '../components/Shared';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, RiskLevel } from '../types';
import { 
  Send, Bot, User, Sparkles, Paperclip, StopCircle, 
  UploadCloud, FileText, Globe, ScanSearch, 
  AlertTriangle, CheckCircle2, FileDown, ArrowRight,
  Play
} from 'lucide-react';
import { cn } from '../utils';

// --- Widget Components ---

const UploadWidget = ({ onUpload }: { onUpload: (files: File[]) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleComplete = () => {
    if (uploadedFiles.length > 0) onUpload(uploadedFiles);
  };

  return (
    <div className="mt-2 w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
        <UploadCloud size={16} className="mr-2 text-brand-400" /> 
        Step 1: Ingest Compliance Documents
      </h4>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-all",
          isDragging ? "border-brand-500 bg-brand-500/10" : "border-slate-600 hover:border-slate-500"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <FileText size={24} className="mx-auto text-slate-500 mb-2" />
        <p className="text-xs text-slate-400">Drag & drop policies, contracts, or prior audit reports.</p>
        <button className="mt-2 text-xs text-brand-400 hover:underline">Or browse files</button>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((f, i) => (
            <div key={i} className="flex items-center text-xs text-slate-300 bg-slate-900 p-2 rounded">
              <FileText size={12} className="mr-2" /> {f.name}
            </div>
          ))}
          <button 
            onClick={handleComplete}
            className="w-full mt-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium py-2 rounded flex items-center justify-center transition-colors"
          >
            Process {uploadedFiles.length} Files <ArrowRight size={12} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

const JurisdictionWidget = ({ onSelect }: { onSelect: (regions: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const regions = ["European Union (EU)", "United States (Federal)", "California (CCPA)", "India (DPDP)", "Singapore (PDPA)"];

  const toggleRegion = (r: string) => {
    setSelected(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  return (
    <div className="mt-2 w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
        <Globe size={16} className="mr-2 text-blue-400" /> 
        Step 2: Jurisdiction Setup
      </h4>
      <div className="space-y-2 mb-4">
        {regions.map(r => (
          <div 
            key={r} 
            onClick={() => toggleRegion(r)}
            className={cn(
              "p-2 rounded border text-xs cursor-pointer flex items-center justify-between transition-all",
              selected.includes(r) 
                ? "bg-blue-500/20 border-blue-500 text-white" 
                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
            )}
          >
            {r}
            {selected.includes(r) && <CheckCircle2 size={12} className="text-blue-400" />}
          </div>
        ))}
      </div>
      <button 
        onClick={() => onSelect(selected)}
        disabled={selected.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium py-2 rounded flex items-center justify-center"
      >
        Confirm Jurisdictions <ArrowRight size={12} className="ml-1" />
      </button>
    </div>
  );
};

const ProgressWidget = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing scan...");

  useEffect(() => {
    const steps = [
      { p: 20, s: "Scanning uploaded documents..." },
      { p: 45, s: "Cross-referencing with EU AI Act..." },
      { p: 70, s: "Checking India DPDP compliance..." },
      { p: 90, s: "Detecting risk gaps..." },
      { p: 100, s: "Analysis complete." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      setProgress(steps[currentStep].p);
      setStatus(steps[currentStep].s);
      currentStep++;
    }, 1000); // Simulated delay

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="mt-2 w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-4">
       <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
        <ScanSearch size={16} className="mr-2 text-purple-400 animate-pulse" /> 
        Step 3 & 4: Scanning & Detection
      </h4>
      <div className="w-full bg-slate-900 rounded-full h-2 mb-2 overflow-hidden">
        <div 
          className="bg-purple-500 h-2 rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 font-mono">
        <span>{status}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

const ResultsWidget = ({ onGenerateReport }: { onGenerateReport: () => void }) => {
  return (
    <div className="mt-2 w-full max-w-lg bg-slate-800/50 border border-slate-700 rounded-lg p-4">
       <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
        <AlertTriangle size={16} className="mr-2 text-orange-400" /> 
        Step 5: Identified Risks & Generated Tasks
      </h4>
      
      <div className="space-y-3 mb-4">
        <div className="bg-slate-900 p-3 rounded border border-red-500/30 flex items-start">
           <AlertTriangle size={16} className="text-red-500 mt-0.5 mr-2 shrink-0" />
           <div>
             <h5 className="text-sm font-medium text-red-200">Missing AI Impact Assessment</h5>
             <p className="text-xs text-slate-400 mt-1">EU AI Act Art. 29 requires assessment for high-risk systems found in "Employee_Handbook_2024.pdf".</p>
             <div className="mt-2 flex items-center text-xs bg-slate-800 rounded px-2 py-1 w-fit text-slate-300 border border-slate-700">
               <CheckCircle2 size={12} className="mr-1 text-green-500" /> Task Auto-Created: TSK-204
             </div>
           </div>
        </div>

        <div className="bg-slate-900 p-3 rounded border border-orange-500/30 flex items-start">
           <AlertTriangle size={16} className="text-orange-500 mt-0.5 mr-2 shrink-0" />
           <div>
             <h5 className="text-sm font-medium text-orange-200">Consent Framework Gap (India)</h5>
             <p className="text-xs text-slate-400 mt-1">DPDP Act 2023 requires explicit consent manager integration. Not found in current vendor contracts.</p>
             <div className="mt-2 flex items-center text-xs bg-slate-800 rounded px-2 py-1 w-fit text-slate-300 border border-slate-700">
               <CheckCircle2 size={12} className="mr-1 text-green-500" /> Task Auto-Created: TSK-205
             </div>
           </div>
        </div>
      </div>

      <button 
        onClick={onGenerateReport}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium py-2 rounded flex items-center justify-center transition-colors"
      >
        Proceed to Audit Reporting <ArrowRight size={12} className="ml-1" />
      </button>
    </div>
  );
};

const ReportWidget = () => {
  return (
    <div className="mt-2 w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
        <CheckCircle2 size={16} className="mr-2 text-green-400" /> 
        Step 6: Audit Readiness
      </h4>
      <div className="bg-slate-900 p-4 rounded border border-slate-700 text-center mb-3">
        <FileText size={32} className="mx-auto text-brand-500 mb-2" />
        <div className="text-sm font-medium text-white">Compliance_Audit_Report_2024.pdf</div>
        <div className="text-xs text-slate-500 mb-2">Generated: Just now • Signed: 0x8f...2a</div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white text-xs px-4 py-2 rounded flex items-center justify-center mx-auto">
          <FileDown size={14} className="mr-2" /> Download Evidence
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center">
        This report is immutable and hash-anchored for regulatory submission.
      </p>
    </div>
  );
};


// --- Main Copilot Component ---

const Copilot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello. I am the Finsentsis Autonomous Copilot.\n\nI can assist with real-time Q&A, or you can activate the **Autonomous Compliance Scan** to ingest documents, detect risks, and generate audit-ready workflows.",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Workflow Handlers ---

  const startWorkflow = () => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: "Run a full autonomous compliance scan.",
      timestamp: new Date(),
      type: 'text'
    };
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: "Initializing Finsentsis OS Workflow.\nPlease upload your relevant policy documents, contracts, or prior filings to begin the ingestion process.",
      timestamp: new Date(),
      type: 'upload_request'
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleFileUpload = (files: File[]) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Uploaded ${files.length} documents: ${files.map(f => f.name).join(', ')}`,
      timestamp: new Date(),
      type: 'text'
    };
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: "Documents ingested and parsed successfully. \n\nNow, please select the jurisdictions you operate in to configure the regulatory baseline.",
      timestamp: new Date(),
      type: 'jurisdiction_selection'
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleJurisdictionSelect = (regions: string[]) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Selected jurisdictions: ${regions.join(', ')}`,
      timestamp: new Date(),
      type: 'text'
    };

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: "Configuration confirmed. Initiating AI Regulation Scan & Gap Detection...",
      timestamp: new Date(),
      type: 'scan_progress'
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleScanComplete = () => {
    const botMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'model',
      content: "Scan Complete. \n\nI have detected critical gaps in your documentation against the EU AI Act and India DPDP Act. Automated tasks have been generated.",
      timestamp: new Date(),
      type: 'analysis_result'
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleGenerateReport = () => {
     const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: "Generate final audit report.",
      timestamp: new Date(),
      type: 'text'
    };

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: "Compiling evidence... Report generated successfully.",
      timestamp: new Date(),
      type: 'report_download'
    };
    
    const finalMsg: ChatMessage = {
      id: (Date.now() + 2).toString(),
      role: 'model',
      content: "The workflow is complete. I am now in **24/7 Assistant Mode**. You can ask me specific questions about these findings or any other regulatory topic.",
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMsg, botMsg, finalMsg]);
  };

  // --- Standard Chat Handler ---

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMsg.content, messages);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || "I apologize, but I couldn't process that request.",
        timestamp: new Date(),
        type: 'text',
        citations: response.text?.includes("Act") ? ["Official Gazette", "Regulation Art. 5"] : undefined
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Autonomous Copilot">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-6 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex space-x-4", msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-1",
                msg.role === 'model' ? "bg-brand-600 text-white" : "bg-slate-700 text-slate-300"
              )}>
                {msg.role === 'model' ? <Bot size={20} /> : <User size={20} />}
              </div>
              
              <div className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                {msg.content && (
                   <div className={cn(
                    "p-5 rounded-2xl text-sm leading-relaxed shadow-md whitespace-pre-line",
                    msg.role === 'model' 
                      ? "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none" 
                      : "bg-brand-600 text-white rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                )}

                {/* Interactive Widgets */}
                {msg.type === 'upload_request' && <UploadWidget onUpload={handleFileUpload} />}
                {msg.type === 'jurisdiction_selection' && <JurisdictionWidget onSelect={handleJurisdictionSelect} />}
                {msg.type === 'scan_progress' && <ProgressWidget onComplete={handleScanComplete} />}
                {msg.type === 'analysis_result' && <ResultsWidget onGenerateReport={handleGenerateReport} />}
                {msg.type === 'report_download' && <ReportWidget />}
                
                {msg.citations && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.citations.map((cite, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-400 hover:text-brand-400 cursor-pointer transition-colors flex items-center">
                        <Paperclip size={10} className="mr-1"/> {cite}
                      </span>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] text-slate-600 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex space-x-4 animate-pulse">
               <div className="w-10 h-10 rounded-full bg-brand-900/50 flex items-center justify-center shrink-0 border border-brand-500/20">
                 <Sparkles size={18} className="text-brand-500" />
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative z-10">
          <input 
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none pr-12 text-sm max-h-32"
            placeholder="Type your question or request..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            autoFocus
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isLoading ? <StopCircle size={18} /> : <Send size={18} />}
            </button>
          </div>
          
          {/* Quick Action Chips */}
          <div className="absolute -top-10 left-0 flex space-x-2">
             <button 
                onClick={startWorkflow}
                className="flex items-center space-x-1.5 text-xs bg-brand-600 text-white border border-brand-500 px-3 py-1.5 rounded-full hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/20 transition-all animate-in slide-in-from-bottom-2 duration-500"
              >
                  <Play size={12} fill="currentColor" />
                  <span className="font-semibold">Start Autonomous Scan</span>
              </button>

              <button onClick={() => setInput("What is the impact of the EU AI Act on our HR hiring models?")} className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-full hover:bg-slate-700 hover:text-white transition-colors">
                  Check AI Act Impact
              </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-2">
            Finsentsis OS | 24/7 AI Compliance Assistant
        </p>
      </div>
    </PageContainer>
  );
};

export default Copilot;
