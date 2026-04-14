import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, MessageSquare, Plus, ChevronLeft, Terminal, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function ChatWorkspace({ project }) {
  const [sessions, setSessions] = useState([]); // List of all sessions for this project
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const API_BASE_URL = "https://monolith-mapper-653442272612.asia-south1.run.app";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ─── 1. LOAD SESSIONS FROM LOCALSTORAGE (Story Logic) ───
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`sessions_${project.id}`)) || [];
    setSessions(saved);
  }, [project.id]);

  // ─── 2. START NEW SESSION ───
  const createNewSession = async () => {
    setIsTyping(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/session/new`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const newSession = {
          id: data.session_id,
          name: `Analysis #${sessions.length + 1}`,
          timestamp: new Date().toLocaleString()
        };
        const updatedSessions = [newSession, ...sessions];
        setSessions(updatedSessions);
        localStorage.setItem(`sessions_${project.id}`, JSON.stringify(updatedSessions));
        
        setActiveSessionId(data.session_id);
        setMessages([{ role: "ai", content: `Neural handshake complete. I am ready to analyze "${project.name}". What is your first query?` }]);
      }
    } catch (e) { console.error("Session creation failed"); }
    setIsTyping(false);
  };

  // ─── 3. LOAD EXISTING HISTORY ───
  const loadHistory = async (sid) => {
    setActiveSessionId(sid);
    setIsTyping(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/session/${sid}/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages.map(m => ({
          role: m.role === 'human' ? 'user' : 'ai',
          content: m.content
        })));
      }
    } catch (e) { console.error("History fetch failed"); }
    setIsTyping(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ message: userMsg, session_id: activeSessionId, write_to_file: null })
      });
      const data = await res.json();
      if (res.ok) setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (err) { console.error("Chat failed"); }
    finally { setIsTyping(false); }
  };

  return (
    <div className="chat-layout-wrapper">
      
      {/* ── SESSIONS SIDEBAR (Unique Session List) ── */}
      <aside className="chat-sessions-sidebar">
        <button className="new-session-btn" onClick={createNewSession}>
          <Plus size={18} /> New Chat
        </button>
        
        <div className="session-list">
          <span className="sidebar-label">RECENT ANALYSIS</span>
          {sessions.map(s => (
            <div 
              key={s.id} 
              className={`session-item ${activeSessionId === s.id ? 'active' : ''}`}
              onClick={() => loadHistory(s.id)}
            >
              <MessageSquare size={16} />
              <div className="session-meta">
                <span className="session-name">{s.name}</span>
                <span className="session-time">{s.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN CONVERSATION AREA ── */}
      <main className="chat-main">
        {!activeSessionId ? (
          <div className="chat-welcome-state">
            <div className="terminal-icon"><Bot size={40} /></div>
            <h2>Workspace Ready</h2>
            <p>Select a previous session or start a new chat to begin codebase mapping.</p>
            <button className="btn-primary" onClick={createNewSession}>Start Analysis</button>
          </div>
        ) : (
          <>
            <div className="chat-terminal-header">
              <div className="header-left">
                {/* <Bot size={18} color="var(--cyan)" />  */}
                <span> MONOLITH_AI - {activeSessionId.slice(0,8)}</span>
              </div>
              <button className="btn-exit" onClick={() => setActiveSessionId(null)}><ChevronLeft size={16}/> Back</button>
            </div>

            <div className="chat-stream">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-row ${msg.role}`}>
                  <div className="bubble-avatar">
                    {msg.role === 'ai' ? <Bot size={16}/> : <User size={16}/>}
                  </div>
                  <div className="bubble-text">
                    {msg.role === 'ai' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                        <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble-row ai">
                  <div className="bubble-avatar"><Bot size={16}/></div>
                  <div className="bubble-content typing">Processing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-footer">
              <form onSubmit={handleSend} className="hacker-input-box">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about logic, refactoring, or bugs..."
                />
                <button type="submit" disabled={!input.trim() || isTyping}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}