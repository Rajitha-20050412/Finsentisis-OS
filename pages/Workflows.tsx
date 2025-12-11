
import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/Shared';
import { getFilteredData } from '../services/dataService';
import { Task, RiskLevel, Evidence, UserProfile } from '../types';
import { MoreHorizontal, Calendar, User, ArrowRightCircle, X, Paperclip, Link as LinkIcon, Plus, Trash2, FileText, ExternalLink, UploadCloud } from 'lucide-react';
import { cn } from '../utils';

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onUpdate }) => {
    const [newEvidenceType, setNewEvidenceType] = useState<'link' | 'file'>('link');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTitle, setLinkTitle] = useState('');

    const handleAddEvidence = () => {
        if (newEvidenceType === 'link' && (!linkUrl || !linkTitle)) return;
        
        const newEvidence: Evidence = {
            id: `EV-${Date.now()}`,
            type: newEvidenceType,
            title: newEvidenceType === 'link' ? linkTitle : `Uploaded_Evidence_${Math.floor(Math.random() * 1000)}.pdf`,
            url: newEvidenceType === 'link' ? linkUrl : '#',
            addedBy: 'Admin User', // Mock user
            date: new Date().toISOString().split('T')[0]
        };
        
        const updatedTask = {
            ...task,
            evidence: [...(task.evidence || []), newEvidence]
        };
        
        onUpdate(updatedTask);
        setLinkUrl('');
        setLinkTitle('');
    };

    const handleDeleteEvidence = (id: string) => {
         const updatedTask = {
            ...task,
            evidence: (task.evidence || []).filter(e => e.id !== id)
        };
        onUpdate(updatedTask);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-800 bg-slate-900">
                    <div>
                         <div className="flex items-center space-x-2 mb-2">
                             <span className="text-xs font-mono text-slate-500">{task.id}</span>
                             <span className={cn(
                                 "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider",
                                 task.priority === RiskLevel.CRITICAL ? "bg-red-500/10 text-red-500" :
                                 task.priority === RiskLevel.HIGH ? "bg-orange-500/10 text-orange-500" :
                                 "bg-blue-500/10 text-blue-500"
                             )}>{task.priority}</span>
                         </div>
                        <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">Description</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {task.description || "No description provided."}
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-500 block mb-1">Assignee</span>
                            <div className="flex items-center text-sm text-slate-200">
                                <User size={14} className="mr-2 text-brand-400"/> {task.assignee}
                            </div>
                        </div>
                         <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-500 block mb-1">Due Date</span>
                            <div className="flex items-center text-sm text-slate-200">
                                <Calendar size={14} className="mr-2 text-brand-400"/> {task.dueDate}
                            </div>
                        </div>
                    </div>

                    {/* Evidence Section */}
                    <div>
                         <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center">
                                <Paperclip size={14} className="mr-2" /> Evidence & Attachments
                            </h3>
                            <span className="text-xs text-slate-500">{(task.evidence || []).length} items</span>
                         </div>
                         
                         {/* Existing Evidence List */}
                         <div className="space-y-2 mb-4">
                             {(task.evidence || []).length === 0 && (
                                 <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-600 text-sm">
                                     No evidence attached yet.
                                 </div>
                             )}
                             {task.evidence?.map(item => (
                                 <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800 rounded-lg group hover:border-slate-700 transition-colors">
                                     <div className="flex items-center space-x-3 overflow-hidden">
                                         <div className="p-2 bg-slate-800 rounded text-slate-400">
                                             {item.type === 'link' ? <LinkIcon size={16} /> : <FileText size={16} />}
                                         </div>
                                         <div className="min-w-0">
                                             <a href={item.url} className="text-sm font-medium text-slate-200 hover:text-brand-400 truncate block hover:underline" target="_blank" rel="noreferrer">
                                                 {item.title}
                                             </a>
                                             <div className="text-xs text-slate-500 flex items-center">
                                                 {item.addedBy} • {item.date}
                                             </div>
                                         </div>
                                     </div>
                                     <button onClick={() => handleDeleteEvidence(item.id)} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             ))}
                         </div>

                         {/* Add Evidence Form */}
                         <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                             <div className="flex space-x-4 mb-4 border-b border-slate-800 pb-2">
                                 <button 
                                     onClick={() => setNewEvidenceType('link')}
                                     className={cn("pb-2 text-sm font-medium transition-colors relative", newEvidenceType === 'link' ? "text-brand-400" : "text-slate-500 hover:text-slate-300")}
                                 >
                                     <LinkIcon size={14} className="inline mr-1" /> Add Link
                                     {newEvidenceType === 'link' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 -mb-2.5 rounded-t-full"></div>}
                                 </button>
                                 <button 
                                     onClick={() => setNewEvidenceType('file')}
                                     className={cn("pb-2 text-sm font-medium transition-colors relative", newEvidenceType === 'file' ? "text-brand-400" : "text-slate-500 hover:text-slate-300")}
                                 >
                                     <UploadCloud size={14} className="inline mr-1" /> Upload File
                                     {newEvidenceType === 'file' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 -mb-2.5 rounded-t-full"></div>}
                                 </button>
                             </div>

                             {newEvidenceType === 'link' ? (
                                 <div className="space-y-3">
                                     <input 
                                         type="text" 
                                         placeholder="Link URL (e.g. https://docs.google.com/...)"
                                         className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                         value={linkUrl}
                                         onChange={(e) => setLinkUrl(e.target.value)}
                                     />
                                     <div className="flex space-x-2">
                                         <input 
                                             type="text" 
                                             placeholder="Display Title"
                                             className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                             value={linkTitle}
                                             onChange={(e) => setLinkTitle(e.target.value)}
                                         />
                                         <button 
                                             onClick={handleAddEvidence}
                                             disabled={!linkUrl || !linkTitle}
                                             className="bg-brand-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                         >
                                             Add
                                         </button>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="border border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                     <UploadCloud size={32} className="text-slate-600 mb-2" />
                                     <p className="text-slate-400 text-sm mb-4">Drag and drop files here, or click to upload</p>
                                     <button 
                                        onClick={handleAddEvidence}
                                        className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded text-sm hover:bg-slate-700 hover:text-white transition-colors"
                                     >
                                         Select File (Simulation)
                                     </button>
                                 </div>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const KanbanColumn = ({ title, tasks, status, onTaskClick }: { title: string, tasks: Task[], status: string, onTaskClick: (task: Task) => void }) => (
  <div className="flex flex-col h-full min-w-[300px] bg-slate-900/50 rounded-xl border border-slate-800/50">
    <div className="p-4 flex items-center justify-between border-b border-slate-800/50">
      <h3 className="font-semibold text-slate-300 text-sm uppercase tracking-wide flex items-center">
        <span className={cn(
            "w-2 h-2 rounded-full mr-2",
            status === 'To Do' ? "bg-slate-500" :
            status === 'In Progress' ? "bg-blue-500" :
            status === 'Review' ? "bg-yellow-500" : "bg-green-500"
        )} />
        {title} 
        <span className="ml-2 px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-500">{tasks.length}</span>
      </h3>
      <button className="text-slate-600 hover:text-slate-400"><MoreHorizontal size={16}/></button>
    </div>
    <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
      {tasks.map(task => (
        <div 
            key={task.id} 
            onClick={() => onTaskClick(task)}
            className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-sm hover:border-brand-500/50 group cursor-pointer transition-all hover:shadow-md hover:shadow-brand-500/5"
        >
           <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-mono text-slate-500">{task.id}</span>
             <span className={cn(
                 "text-[10px] px-1.5 py-0.5 rounded font-medium",
                 task.priority === RiskLevel.CRITICAL ? "bg-red-500/10 text-red-500" :
                 task.priority === RiskLevel.HIGH ? "bg-orange-500/10 text-orange-500" :
                 "bg-blue-500/10 text-blue-500"
             )}>{task.priority}</span>
           </div>
           <h4 className="text-sm font-medium text-slate-200 mb-3 group-hover:text-brand-400 transition-colors">{task.title}</h4>
           
           <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
             <div className="flex items-center text-xs text-slate-500">
               <User size={12} className="mr-1" /> {task.assignee.split(' ')[0]}
             </div>
             <div className="flex items-center space-x-3">
                 {(task.evidence && task.evidence.length > 0) && (
                     <div className="flex items-center text-xs text-slate-500" title={`${task.evidence.length} attachments`}>
                        <Paperclip size={12} className="mr-1" /> {task.evidence.length}
                    </div>
                 )}
                <div className="flex items-center text-xs text-slate-500">
                    <Calendar size={12} className="mr-1" /> {task.dueDate}
                </div>
             </div>
           </div>
        </div>
      ))}
      <button className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm hover:border-slate-600 hover:text-slate-400 hover:bg-slate-800/50 transition-all">
          + Add Task
      </button>
    </div>
  </div>
);

interface WorkflowsProps {
    userProfile: UserProfile | null;
}

const Workflows: React.FC<WorkflowsProps> = ({ userProfile }) => {
  const { tasks: initialTasks } = getFilteredData(userProfile);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Update tasks if profile changes (though usually component remounts)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const progressTasks = tasks.filter(t => t.status === 'In Progress');
  const reviewTasks = tasks.filter(t => t.status === 'Review');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const handleTaskUpdate = (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      setSelectedTask(updatedTask);
  };

  return (
    <PageContainer title="Workflows & Remediation">
      <div className="flex flex-col h-full">
         <div className="flex items-center justify-between mb-6">
             <div className="flex space-x-2">
                 {['All', 'Assigned to Me', 'Critical Only'].map(filter => (
                     <button key={filter} className="px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                         {filter}
                     </button>
                 ))}
             </div>
             <button className="flex items-center bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-500">
                 <ArrowRightCircle size={16} className="mr-2" /> Auto-Generate from Policy
             </button>
         </div>

         {tasks.length > 0 ? (
            <div className="flex-1 overflow-x-auto custom-scrollbar">
                <div className="flex h-full space-x-6 pb-4 min-w-max">
                    <KanbanColumn title="To Do" tasks={todoTasks} status="To Do" onTaskClick={setSelectedTask} />
                    <KanbanColumn title="In Progress" tasks={progressTasks} status="In Progress" onTaskClick={setSelectedTask} />
                    <KanbanColumn title="In Review" tasks={reviewTasks} status="Review" onTaskClick={setSelectedTask} />
                    <KanbanColumn title="Audit Ready" tasks={doneTasks} status="Done" onTaskClick={setSelectedTask} />
                </div>
            </div>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                 <p>No tasks found for your current profile configuration.</p>
                 <button className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-white text-sm hover:bg-slate-700">Create Manual Task</button>
             </div>
         )}

         {selectedTask && (
             <TaskDetailModal 
                task={selectedTask} 
                onClose={() => setSelectedTask(null)} 
                onUpdate={handleTaskUpdate}
             />
         )}
      </div>
    </PageContainer>
  );
};

export default Workflows;
