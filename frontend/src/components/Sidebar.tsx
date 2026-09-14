import React, { useRef, useState } from 'react';
import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  Globe,
  Files,
  ShieldCheck,
  Key,
  Image,
  FileCode,
  Sparkles,
  Sun,
  Moon,
  Plus,
  MessageSquare,
  Clock
} from 'lucide-react';
import type { DocFile, ApiKeyStatus, ChatSession } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  files: DocFile[];
  activeTarget: string;
  onSelectTarget: (target: string) => void;
  onUpload: (files: FileList | File[]) => void;
  onDeleteFile: (filename: string) => void;
  onPreviewFile: (file: DocFile) => void;
  status: ApiKeyStatus | null;
  onOpenSettings: () => void;
  // Chat History Props
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearHistory?: () => void;
}

function formatTime(timestamp: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const diffMinutes = Math.floor((now - timestamp) / (1000 * 60));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const Sidebar: React.FC<SidebarProps> = ({
  files,
  activeTarget,
  onSelectTarget,
  onUpload,
  onDeleteFile,
  onPreviewFile,
  status,
  onOpenSettings,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearHistory,
}) => {
  const { isNight, toggleTheme, theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'history' | 'workspace'>('workspace');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const renderFileIcon = (file: DocFile) => {
    if (file.type === 'image') return <Image className="w-4 h-4 text-purple-400 shrink-0" />;
    if (file.type === 'pdf') return <FileText className="w-4 h-4 text-rose-400 shrink-0" />;
    return <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />;
  };

  return (
    <aside className="w-80 sidebar-bg border-r border-theme-subtle flex flex-col h-screen shrink-0 select-none transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-theme-subtle flex items-center justify-between header-bg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-theme-primary font-heading tracking-tight flex items-center gap-1.5">
              <span>DocuAgent</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                AI
              </span>
            </h1>
            <p className="text-[11px] font-bold text-theme-muted">QC & Document Intelligence</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isNight ? "Switch to White Mode" : "Switch to Night Mode"}
          className="p-2 rounded-xl card-bg border border-theme-subtle hover:border-blue-500/40 text-theme-secondary hover:text-theme-primary transition-all flex items-center justify-center group shadow-sm cursor-pointer"
          aria-label="Toggle Theme Mode"
        >
          {isNight ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>

      {/* AI Key & Provider Bar */}
      <div className="px-4 py-2.5 border-b border-theme-subtle bg-black/[0.02] dark:bg-white/[0.02]">
        <button
          onClick={onOpenSettings}
          className="w-full p-2.5 rounded-xl card-bg hover:bg-black/5 dark:hover:bg-white/5 border border-theme-subtle hover:border-blue-500/50 transition-all flex items-center justify-between group shadow-sm cursor-pointer"
        >
          <div className="flex items-center space-x-2 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-left truncate">
              <div className="text-[10px] text-theme-muted uppercase tracking-wider font-bold">Active AI Engine</div>
              <div className="text-xs font-bold text-theme-primary truncate">
                {status ? status.active_provider : 'Configuring...'}
                {status && <span className="text-theme-muted font-semibold ml-1">({status.active_model})</span>}
              </div>
            </div>
          </div>
          <Key className="w-4 h-4 text-theme-muted group-hover:text-blue-500 transition-colors shrink-0" />
        </button>
      </div>

      {/* + New Chat Action Button */}
      <div className="px-4 pt-3 pb-1">
        <button
          onClick={() => {
            onNewChat();
            setSidebarTab('history');
          }}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4 stroke-[3] group-hover:scale-110 transition-transform" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Left-Side Navigation Tabs: Chat History vs Workspace */}
      <div className="px-4 py-2 flex items-center space-x-1.5 border-b border-theme-subtle">
        <button
          onClick={() => setSidebarTab('history')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            sidebarTab === 'history'
              ? 'bg-blue-600/15 text-blue-600 dark:text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat History</span>
          {sessions.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full font-mono font-bold">
              {sessions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSidebarTab('workspace')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            sidebarTab === 'workspace'
              ? 'bg-blue-600/15 text-blue-600 dark:text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
          }`}
        >
          <Files className="w-3.5 h-3.5" />
          <span>Documents</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded-full font-mono font-bold">
            {files.length}
          </span>
        </button>
      </div>

      {/* Scrollable Content: Either History or Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {sidebarTab === 'history' ? (
          /* Chat History View */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3 h-3" />
                <span>History of Chat ({sessions.length})</span>
              </label>
              {sessions.length > 0 && onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-theme-muted card-bg rounded-2xl border border-theme-subtle space-y-2">
                <MessageSquare className="w-8 h-8 text-theme-muted mx-auto opacity-40" />
                <p>No chat history yet.</p>
                <p className="text-[11px] font-medium text-theme-muted">
                  Type a question in the search bar or run a QC audit to record conversation history.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => {
                  const isSelected = activeSessionId === session.id;
                  const timeLabel = formatTime(session.updatedAt || session.createdAt);
                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 shadow-sm'
                          : 'card-bg border-theme-subtle hover:bg-black/5 dark:hover:bg-white/5 hover:border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5 min-w-0 flex-1 mr-2">
                        <MessageSquare
                          className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-500' : 'text-theme-muted'}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs truncate font-bold ${isSelected ? 'text-blue-600 dark:text-blue-300' : 'text-theme-primary'}`}>
                            {session.title || 'Conversation'}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-theme-muted font-bold mt-0.5">
                            <span>{timeLabel}</span>
                            <span>•</span>
                            <span>{session.messages ? session.messages.length : 0} msgs</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        title="Delete conversation"
                        className="p-1.5 text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-70 group-hover:opacity-100 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Workspace & Documents View */
          <div className="space-y-5">
            {/* Mode Switcher: General Assistant */}
            <div>
              <button
                onClick={() => onSelectTarget(activeTarget === '__general__' ? '__all__' : '__general__')}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeTarget === '__general__'
                    ? 'bg-purple-600/15 border-purple-500 text-purple-600 dark:text-purple-300 font-bold shadow-sm'
                    : 'card-bg border-theme-subtle text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-theme-primary font-semibold'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Globe className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-xs truncate font-bold">General Assistant</span>
                </div>
                {activeTarget === '__general__' && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Multi-file Upload Zone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                  Document Workspace ({files.length})
                </label>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-blue-500 bg-blue-500/10 scale-[0.99]'
                    : 'border-theme-medium hover:border-blue-500/50 card-bg'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && onUpload(e.target.files)}
                  multiple
                  className="hidden"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                />
                <UploadCloud className="w-7 h-7 text-blue-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-theme-primary">Drop PDFs or click to upload</p>
                <p className="text-[10px] font-semibold text-theme-muted mt-0.5">PDF, Word, Images, Text supported</p>
              </div>
            </div>

            {/* Uploaded Document List */}
            <div className="space-y-1.5">
              {files.length === 0 ? (
                <div className="p-4 text-center text-xs font-bold text-theme-muted card-bg rounded-xl border border-theme-subtle">
                  No files uploaded yet. Drag and drop order files above to begin QC.
                </div>
              ) : (
                files.map((file) => {
                  const isSelected = activeTarget === file.name;
                  return (
                    <div
                      key={file.name}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 shadow-sm'
                          : 'card-bg border-theme-subtle hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div
                        onClick={() => onSelectTarget(file.name)}
                        className="flex items-center space-x-2.5 min-w-0 cursor-pointer flex-1 mr-2"
                      >
                        {renderFileIcon(file)}
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs truncate font-bold ${isSelected ? 'text-blue-600 dark:text-blue-300' : 'text-theme-primary'}`}>
                            {file.name}
                          </p>
                          <p className="text-[10px] font-bold text-theme-muted">{file.size_kb} KB</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => onPreviewFile(file)}
                          title="View File Preview"
                          className="p-1 text-theme-muted hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.name)}
                          title="Delete Document"
                          className="p-1 text-theme-muted hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-theme-subtle text-center text-[10px] font-bold text-theme-muted header-bg flex items-center justify-between px-4">
        <span>DocuAgent AI v2.0</span>
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-theme-subtle font-bold">
          {theme} mode
        </span>
      </div>
    </aside>
  );
};
