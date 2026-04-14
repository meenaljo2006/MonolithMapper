import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Code2, Settings, LogOut, Plus, FolderGit2, Calendar, 
  ChevronRight, X, Activity, Database, Cpu
} from "lucide-react";
import "./dashboard.css";
import ProjectIngestion from "../components/dashboard/ProjectIngestion";
import ChatWorkspace from "../components/dashboard/ChatWorkspace";

const getUsernameFromToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return "Dev";
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.username || "Dev";
  } catch (e) { return "Dev"; }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [sysHealth, setSysHealth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      setUsername(getUsernameFromToken());
      const savedProjects = JSON.parse(localStorage.getItem('monolith_projects')) || [];
      setProjects(savedProjects);
      fetchHealth();
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchHealth = async () => {
    try {
      const res = await fetch("https://monolith-mapper-653442272612.asia-south1.run.app/health");
      setSysHealth(await res.json());
    } catch (e) { console.error("Health check failed", e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject = {
      id: `proj_${Date.now()}`,
      name: newProjectName,
      createdAt: new Date().toLocaleDateString(),
      status: "empty"
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('monolith_projects', JSON.stringify(updatedProjects));
    
    setNewProjectName("");
    setIsModalOpen(false);
    setActiveProjectId(newProject.id);
  };

  const updateProjectDetails = (projectId, updates) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('monolith_projects', JSON.stringify(updatedProjects));
  };

  const totalNodes = projects.reduce((sum, proj) => sum + (proj.nodeCount || 0), 0);
  const indexedProjectsCount = projects.filter(p => p.status === 'indexed').length;

  // 2. DYNAMIC TOKENS: Real state variable (abhi 0 hai, chat banne pe update hogi)
  const [tokensUsed, setTokensUsed] = useState(0); 
  const TOKEN_LIMIT = 5000000; // 5 Million
  const tokenProgressPercent = (tokensUsed / TOKEN_LIMIT) * 100;

  if (isLoading) return null;
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="dashboard-layout">
      
      {/* ── MODERN TOP NAVBAR ── */}
      <header className="top-navbar">
        <div className="nav-left">
          <div className="brand-logo" style={{ cursor: 'pointer' }} onClick={() => setActiveProjectId(null)}>
            <Code2 size={24} color="var(--cyan)" />
            <span>MonolithMapper</span>
          </div>

          {/* Breadcrumbs next to Logo */}
          <div className="breadcrumbs">
            {activeProject ? (
              <>
                <span className="crumb-link" onClick={() => setActiveProjectId(null)}>Workspaces</span>
                <ChevronRight size={14} color="var(--text-3)" />
                <span className="crumb-current">{activeProject.name}</span>
              </>
            ) : (
              <span className="crumb-current">Overview</span>
            )}
          </div>
        </div>

        <div className="nav-right">
          <div className="status-pill" title="System Status">
            <div className={`status-dot ${sysHealth?.status === 'ready' ? 'green' : 'red'}`}></div>
            <span>{sysHealth?.status === 'ready' ? 'ONLINE' : 'CONNECTING'}</span>
          </div>
          
          <div className="icon-action" title="Settings">
            <Settings size={20} />
          </div>
          
          <div className="icon-action logout" title="Sign Out" onClick={handleLogout}>
            <LogOut size={20} />
          </div>

          <div className="user-profile">
            <span>{username}</span>
            <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="dashboard-body">
        
        {!activeProjectId ? (
          /* STATE A: PROJECTS DASHBOARD */
          <div className="workspace-view">

            {/* LIVE SYSTEM INSIGHTS */}
            {/* ── CENTRAL TELEMETRY HUD (The Wow Factor) ── */}
            <div className="telemetry-hud">
              <div className="hud-pulse">
                <div className={`pulse-core ${sysHealth?.status === 'ready' ? 'online' : 'offline'}`}></div>
                <div className="pulse-ring"></div>
              </div>
              
              <div className="hud-metrics">
                {/* Vector Core */}
                <div className="hud-item">
                  <span className="hud-label">VECTOR CORE</span>
                  <span className="hud-value" style={{ color: sysHealth?.qdrant ? 'var(--cyan)' : '#ff4466', textShadow: sysHealth?.qdrant ? '0 0 10px rgba(0,255,209,0.5)' : 'none' }}>
                    {sysHealth?.qdrant ? 'OPTIMIZED' : 'OFFLINE'}
                  </span>
                </div>

                <div className="hud-divider"></div>

                {/* Neural Engine */}
                <div className="hud-item">
                  <span className="hud-label">NEURAL ENGINE</span>
                  <span className="hud-value" style={{ color: sysHealth?.llm ? '#b388ff' : 'var(--text-3)', textShadow: sysHealth?.llm ? '0 0 10px rgba(179,136,255,0.5)' : 'none' }}>
                    {sysHealth?.llm ? 'READY' : 'STANDBY'}
                  </span>
                </div>

                <div className="hud-divider"></div>

                {/* USER VALUE: Knowledge Base Size */}
                <div className="hud-item">
                  <span className="hud-label">KNOWLEDGE NODES</span>
                  <span className="hud-value" style={{ color: '#fff' }}>{totalNodes > 0 ? totalNodes.toLocaleString() : "0"}</span>
                  <span className="hud-sub">Across {indexedProjectsCount} workspaces</span>
                </div>

                <div className="hud-divider"></div>

                {/* USER VALUE: Token Usage */}
                <div className="hud-item">
                  <span className="hud-label">MONTHLY TOKENS</span>
                  <span className="hud-value" style={{ color: '#fff' }}>1.2M <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>/ 5M</span></span>
                  <div className="progress-bar-mini"><div className="progress-fill" style={{ width: '24%' }}></div></div>
                </div>
              </div>
            </div>

            <div className="section-header">
              <div>
                <h2>Your Workspaces</h2>
                <p>Manage your legacy codebases and monitor system health.</p>
              </div>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> New Workspace
              </button>
            </div>

            {/* PROJECTS GRID */}
            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FolderGit2 size={40} /></div>
                <h3>No workspaces found</h3>
                <p>Create a secure workspace to ingest your code and begin AI analysis.</p>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Create First Workspace</button>
              </div>
            ) : (
              <div className="neural-list-container">
                <div className="neural-spine"></div>
                <div className="neural-list">
                  {projects.map((proj, index) => (
                    <div 
                      key={proj.id} 
                      className="neural-row" 
                      onClick={() => setActiveProjectId(proj.id)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="row-node"></div>
                      
                      <div className="row-left">
                        <div className="row-icon"><Code2 size={20} /></div>
                        <div className="row-info">
                          <h3>{proj.name}</h3>
                          <div className="row-meta">
                            <Calendar size={12} /> <span>Created {proj.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="row-right">
                        <span className={`badge ${proj.status}`}>{proj.status}</span>
                        <ChevronRight size={18} className="row-arrow" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STATE B & C: ACTIVE PROJECT (Ingestion OR Chat) */
          <div className="active-project-view" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
             {activeProject.status === "empty" ? (
               <ProjectIngestion 
                  project={activeProject} 
                  onIngestionComplete={(updates) => updateProjectDetails(activeProject.id, updates)} 
               />
             ) : (
               <ChatWorkspace project={activeProject} />
             )}
          </div>
        )}
      </main>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-box" style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '420px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>New Workspace</h2>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-3)' }} onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '8px' }}>Workspace Name</label>
                <input 
                  autoFocus
                  placeholder="e.g., monolith-backend-v1" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface2)', color: '#fff', fontSize: '15px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={!newProjectName.trim()} style={{ flex: 1, padding: '10px', background: 'var(--cyan)', border: 'none', color: '#000', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}