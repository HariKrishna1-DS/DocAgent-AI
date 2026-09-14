import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { CodeSandboxModal } from './components/CodeSandboxModal';
import { DailyGameDrawer } from './components/DailyGameDrawer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getStreakData } from './services/gamePuzzles';
import type {
  DocFile,
  ChatMessage,
  ChatSession,
  ApiKeyStatus
} from './services/api';
import {
  fetchFiles,
  fetchApiKeyStatus,
  uploadFiles,
  deleteFile,
  askDocument
} from './services/api';

function AppContent() {
  useTheme();
  const [files, setFiles] = useState<DocFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTarget, setActiveTarget] = useState<string>('__all__');
  const [status, setStatus] = useState<ApiKeyStatus | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // Chat History & Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('docuagent_chat_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('docuagent_active_session_id');
      if (savedId) return savedId;
      const savedSessions = localStorage.getItem('docuagent_chat_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (parsed && parsed.length > 0) return parsed[0].id;
      }
      return '';
    } catch {
      return '';
    }
  });

  // Modals & Game Drawer
  const [previewFile, setPreviewFile] = useState<DocFile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(() => getStreakData().streak);

  // Initial Load
  useEffect(() => {
    loadFiles();
    loadStatus();
  }, []);

  // Restore active session messages and target on load
  useEffect(() => {
    if (activeSessionId && sessions.length > 0) {
      const session = sessions.find((s) => s.id === activeSessionId);
      if (session) {
        setMessages(session.messages || []);
        if (session.target) {
          setActiveTarget(session.target);
        }
      }
    }
  }, []);

  const loadFiles = async () => {
    try {
      const list = await fetchFiles();
      setFiles(list);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const loadStatus = async () => {
    try {
      const s = await fetchApiKeyStatus();
      setStatus(s);
    } catch (err) {
      console.error('Failed to load status:', err);
    }
  };

  // Synchronize conversation messages into sessions & localStorage
  const updateCurrentSessionMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);

    let currentId = activeSessionId;
    if (!currentId) {
      currentId = `session_${Date.now()}`;
      setActiveSessionId(currentId);
      localStorage.setItem('docuagent_active_session_id', currentId);
    }

    setSessions((prevSessions) => {
      const firstUserMsg = newMessages.find((m) => m.role === 'user');
      const titleCandidate = firstUserMsg
        ? (firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? '...' : ''))
        : (activeTarget === '__all__' ? 'All Documents Audit' : `Focus: ${activeTarget}`);

      const existingIndex = prevSessions.findIndex((s) => s.id === currentId);
      let updated: ChatSession[];

      if (existingIndex >= 0) {
        const existing = prevSessions[existingIndex];
        const updatedSession: ChatSession = {
          ...existing,
          title: existing.title && existing.title !== 'New Conversation' ? existing.title : titleCandidate,
          messages: newMessages,
          target: activeTarget,
          updatedAt: Date.now(),
        };
        updated = [
          updatedSession,
          ...prevSessions.filter((_, idx) => idx !== existingIndex),
        ];
      } else {
        const newSession: ChatSession = {
          id: currentId,
          title: titleCandidate,
          messages: newMessages,
          target: activeTarget,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        updated = [newSession, ...prevSessions];
      }

      try {
        localStorage.setItem('docuagent_chat_sessions', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save chat sessions to localStorage:', err);
      }
      return updated;
    });
  };

  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    setActiveSessionId(newId);
    setMessages([]);
    localStorage.setItem('docuagent_active_session_id', newId);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setMessages(session.messages || []);
      if (session.target) {
        setActiveTarget(session.target);
      }
      localStorage.setItem('docuagent_active_session_id', sessionId);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSessions(remaining);
    localStorage.setItem('docuagent_chat_sessions', JSON.stringify(remaining));

    if (activeSessionId === sessionId) {
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleClearHistory = () => {
    if (!confirm('Are you sure you want to clear all chat history?')) return;
    setSessions([]);
    localStorage.removeItem('docuagent_chat_sessions');
    handleNewChat();
  };

  const handleUpload = async (fileList: FileList | File[]) => {
    try {
      setLoading(true);
      const res = await uploadFiles(fileList);
      await loadFiles();
      const updatedMessages = [
        ...messages,
        {
          role: 'assistant' as const,
          content: `📥 **Uploaded ${res.count} file(s) successfully!**\nFiles added: ${res.uploaded.join(', ')}`,
          targetFile: 'Upload System',
        },
      ];
      updateCurrentSessionMessages(updatedMessages);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete '${filename}'?`)) return;
    try {
      await deleteFile(filename);
      if (activeTarget === filename) {
        setActiveTarget('__all__');
      }
      await loadFiles();
    } catch (err: any) {
      alert(`Failed to delete file: ${err.message}`);
    }
  };

  const handleSendMessage = async (question: string) => {
    const userMsg: ChatMessage = { role: 'user', content: question };
    const messagesWithUser = [...messages, userMsg];
    updateCurrentSessionMessages(messagesWithUser);
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await askDocument(question, activeTarget, historyPayload);

      const botMsg: ChatMessage = {
        role: 'assistant',
        content: res.answer,
        targetFile: res.filename,
      };
      updateCurrentSessionMessages([...messagesWithUser, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `⚠️ Error processing request: ${err.message}`,
        targetFile: activeTarget,
      };
      updateCurrentSessionMessages([...messagesWithUser, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden app-bg text-theme-primary font-sans transition-colors duration-200">
      <Sidebar
        files={files}
        activeTarget={activeTarget}
        onSelectTarget={setActiveTarget}
        onUpload={handleUpload}
        onDeleteFile={handleDeleteFile}
        onPreviewFile={setPreviewFile}
        status={status}
        onOpenSettings={() => setIsSettingsOpen(true)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearHistory={handleClearHistory}
      />

      <ChatArea
        messages={messages}
        activeTarget={activeTarget}
        files={files}
        onSendMessage={handleSendMessage}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        loading={loading}
        onUpload={handleUpload}
        onToggleGame={() => setIsGameOpen((prev) => !prev)}
        isGameOpen={isGameOpen}
        streakCount={streakCount}
      />

      <DailyGameDrawer
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        onStreakUpdated={(newStreak) => setStreakCount(newStreak)}
      />

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={status}
        onStatusUpdated={setStatus}
      />

      <DocumentPreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <CodeSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
