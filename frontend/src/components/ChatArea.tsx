import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  Bot,
  User,
  Files,
  Globe,
  FileText,
  Copy,
  Check,
  Terminal,
  RefreshCw,
  Sun,
  Moon,
  MessageSquare,
  Gamepad2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage, DocFile } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface ChatAreaProps {
  messages: ChatMessage[];
  activeTarget: string;
  files: DocFile[];
  onSendMessage: (text: string) => void;
  onOpenSandbox: () => void;
  loading: boolean;
  onUpload: (files: FileList | File[]) => void;
  onToggleGame?: () => void;
  isGameOpen?: boolean;
  streakCount?: number;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  activeTarget,
  files,
  onSendMessage,
  onOpenSandbox,
  loading,
  onUpload,
  onToggleGame,
  isGameOpen,
  streakCount,
}) => {
  const { isNight, toggleTheme } = useTheme();
  const [input, setInput] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  };

  const getTargetTitle = () => {
    if (activeTarget === '__general__') return { name: 'General Assistant', icon: Globe, color: 'text-purple-500' };
    if (activeTarget === '__all__') return { name: files.length > 0 ? `Workspace (${files.length} files)` : 'Document Workspace', icon: Files, color: 'text-blue-500' };
    return { name: `Document: ${activeTarget}`, icon: FileText, color: 'text-emerald-500' };
  };

  const currentTarget = getTargetTitle();

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden app-bg transition-colors duration-200">
      
      {/* Hidden File Input Triggered by the + Button in Search Bar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
      />

      {/* Top Header Bar */}
      <header className="h-16 px-6 border-b border-theme-subtle header-bg backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl card-bg border border-theme-subtle shadow-sm">
            <currentTarget.icon className={`w-5 h-5 ${currentTarget.color}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-theme-primary font-heading flex items-center gap-2">
              <span>{currentTarget.name}</span>
            </h2>
            <p className="text-[11px] font-semibold text-theme-muted">
              Ask questions, analyze documents, or explore insights
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Header Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isNight ? "Switch to White Mode" : "Switch to Night Mode"}
            className="px-3 py-1.5 text-xs font-bold card-bg hover:bg-black/5 dark:hover:bg-white/10 border border-theme-subtle rounded-xl transition-all flex items-center space-x-1.5 text-theme-secondary hover:text-theme-primary shadow-sm"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>White Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Night Mode</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenSandbox}
            className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Sandbox</span>
          </button>

          {onToggleGame && (
            <button
              onClick={onToggleGame}
              title="Play Daily Word Puzzle"
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 border shadow-sm cursor-pointer ${
                isGameOpen
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-amber-500/10'
                  : 'card-bg hover:bg-black/5 dark:hover:bg-white/10 border-theme-subtle text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Daily Game</span>
              {(streakCount ?? 0) > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.2 rounded-full font-black border border-amber-500/30">
                  🔥 {streakCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center space-y-6">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/30 shadow-xl">
              <Bot className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-theme-primary font-heading">
                DocuAgent <span className="gradient-text">AI QC Intelligence</span>
              </h3>
              <p className="text-xs font-semibold text-theme-muted max-w-md mx-auto leading-relaxed">
                Upload your title orders, tax snapshots, PACER & Patriot documents, or cost worksheets to get instant Quality Control audits.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-theme-subtle text-left space-y-2 w-full">
              <div className="flex items-center space-x-2 text-xs font-bold text-theme-primary">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>Quick Getting Started</span>
              </div>
              <ul className="text-xs font-semibold text-theme-secondary space-y-1.5 list-disc list-inside">
                <li>Click the <span className="text-blue-500 font-bold">+</span> button in the search bar below to add documents.</li>
                <li>View previous conversations from the <span className="font-bold text-theme-primary">Chat History</span> on the left side.</li>
                <li>Type questions or audit requests directly in the search bar below.</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 h-fit shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl p-4 space-y-2 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'glass-panel border border-theme-subtle text-theme-primary rounded-bl-none'
                }`}
              >
                {msg.role === 'assistant' && msg.targetFile && (
                  <div className="flex items-center justify-between text-[11px] text-blue-500 dark:text-blue-400 border-b border-theme-subtle pb-2 mb-2 font-bold">
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Context: {msg.targetFile}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="text-theme-muted hover:text-theme-primary flex items-center space-x-1 transition-colors font-bold"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {msg.role === 'user' ? (
                  <p className="text-sm font-bold whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="prose dark:prose-invert prose-sm max-w-none text-theme-primary font-semibold leading-relaxed prose-headings:font-bold prose-headings:text-theme-primary prose-strong:font-black prose-strong:text-theme-primary prose-p:font-semibold prose-li:font-semibold prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:font-bold prose-code:bg-black/5 dark:prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-table:border prose-table:border-theme-subtle prose-th:bg-slate-100 dark:prose-th:bg-slate-800/90 prose-th:text-theme-primary prose-th:p-2 prose-th:font-bold prose-td:p-2 prose-td:border-t prose-td:border-theme-subtle">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-500 h-fit shrink-0 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 shadow-sm">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-panel p-3.5 rounded-2xl border border-theme-subtle flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-300 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>DocuAgent AI is analyzing documents and preparing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar - Clean with "+" File Upload Button and Bold Typography */}
      <div className="p-4 border-t border-theme-subtle header-bg backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="flex items-center w-full input-bg border border-theme-medium focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 rounded-2xl shadow-sm transition-all p-1.5 pl-2">
            
            {/* "+" Symbol Button to Add Files */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Add documents or files (+)"
              className="p-2.5 text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all flex items-center justify-center shrink-0 group shadow-sm mr-1 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5] group-hover:scale-110 transition-transform" />
            </button>

            {/* Typing Search Input Area with Bold Typography */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask a question about ${currentTarget.name}... (Press Enter to send, Shift+Enter for newline)`}
              rows={2}
              className="flex-1 px-2 py-2 text-sm font-semibold text-theme-primary bg-transparent focus:outline-none placeholder:text-theme-muted placeholder:font-normal resize-none font-sans leading-relaxed"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              title="Send message"
              className="p-2.5 text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-600/30 transition-all shrink-0 cursor-pointer self-end mb-1"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
