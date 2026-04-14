import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Eye, EyeOff, ArrowRight, ArrowLeft, GitBranch, Globe, Loader2, AlertCircle } from "lucide-react";
import "./authentication.css";

/* ─────────────────────────────────────────────
   LIVE PIPELINE ACTIVITY (Same as Signup)
───────────────────────────────────────────── */
const PIPELINE_LOGS = [
  { agent: "SYSTEM", msg: "Establishing secure connection...", color: "#00ffd1" },
  { agent: "AUTH", msg: "Verifying encrypted credentials", color: "#4488ff" },
  { agent: "GRAPH", msg: "Loading user knowledge graph", color: "#00d1ac" },
  { agent: "SYSTEM", msg: "Node synchronization complete", color: "#b388ff" },
  { agent: "ROUTER", msg: "Routing to primary dashboard", color: "#00ffd1" },
];

function ActivityStream() {
  const infiniteLogs = [...PIPELINE_LOGS, ...PIPELINE_LOGS, ...PIPELINE_LOGS];

  return (
    <div className="activity-stream-wrap">
      <div className="log-track">
        {infiniteLogs.map((log, i) => (
          <div key={i} className="log-badge">
            <span className="log-agent" style={{ color: log.color }}>
              [{log.agent}]
            </span>
            <span className="log-msg">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VISUAL PANEL (Slightly tweaked text for Login)
───────────────────────────────────────────── */
function VisualPanel() {
  return (
    <div className="left-panel">
      <div className="noise" />
      <div className="scanlines" />
      <div className="orb orb-cyan"/>
      <div className="orb orb-blue" />

      {/* Glow lines */}
      <div className="glow-line" style={{ width:180, bottom:230, right:100, animationDelay:"0s" }} />
      <div className="glow-line" style={{ width:120, bottom:280, right:180, animationDelay:"1.5s" }} />
      <div className="glow-line" style={{ width: 90, bottom:310, right:260, animationDelay:"3s" }} />

      <ActivityStream />

      {/* Isometric SVG scene */}
      <div style={{ position:"absolute", bottom:30, right:-20, width:440, height:420, zIndex:3, pointerEvents:"none" }}>
         {/* EXACT SAME SVG FROM SIGNUP GOES HERE */}
        <svg viewBox="0 0 440 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
          <polygon points="80,290 220,220 360,290 220,360" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
          <polygon points="80,290 80,310 220,380 220,360" fill="#111111" stroke="#222222" strokeWidth="1"/>
          <polygon points="220,360 220,380 360,310 360,290" fill="#0f0f0f" stroke="#1e1e1e" strokeWidth="1"/>
          <polyline points="80,290 220,220 360,290" stroke="rgba(0,209,172,0.18)" strokeWidth="1.5"/>
          <line x1="95" y1="300" x2="95" y2="340" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round"/>
          <line x1="345" y1="300" x2="345" y2="340" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round"/>
          <line x1="220" y1="368" x2="220" y2="400" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round"/>
          <polygon points="140,320 200,288 220,298 160,330" fill="#151515" stroke="#252525" strokeWidth="1"/>
          <polygon points="140,320 140,350 160,360 160,330" fill="#0e0e0e" stroke="#1f1f1f" strokeWidth="1"/>
          <polygon points="160,330 160,360 220,328 220,298" fill="#121212" stroke="#222222" strokeWidth="1"/>
          <polygon points="130,280 145,272 165,282 150,290" fill="#1a1a1a" stroke="#282828" strokeWidth="1"/>
          <line x1="130" y1="280" x2="130" y2="320" stroke="#1a1a1a" strokeWidth="4"/>
          <line x1="150" y1="290" x2="150" y2="330" stroke="#1a1a1a" strokeWidth="4"/>
          <polygon points="200,250 270,215 290,225 220,260" fill="#1e1e1e" stroke="#2e2e2e" strokeWidth="1"/>
          <polygon points="200,250 195,210 265,175 270,215" fill="#0d1f1a" stroke="#00d1ac" strokeWidth="1.5"/>
          <polygon points="202,248 197,212 263,178 268,214" fill="#021a14" opacity="0.95"/>
          <line x1="202" y1="230" x2="240" y2="210" stroke="#00ffd1" strokeWidth="1" opacity="0.7"/>
          <line x1="202" y1="237" x2="255" y2="215" stroke="#00d1ac" strokeWidth="0.8" opacity="0.5"/>
          <line x1="202" y1="244" x2="248" y2="223" stroke="#4488ff" strokeWidth="0.8" opacity="0.4"/>
          <polygon points="174,268 194,258 210,266 190,276" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1"/>
          <polygon points="174,268 174,288 190,296 190,276" fill="#222222" stroke="#333" strokeWidth="1"/>
          <polygon points="190,276 190,296 206,288 206,268" fill="#1e1e1e" stroke="#2e2e2e" strokeWidth="1"/>
          <ellipse cx="184" cy="248" rx="10" ry="11" fill="#2e2e2e" stroke="#3a3a3a" strokeWidth="1"/>
          <ellipse cx="184" cy="244" rx="9" ry="5" fill="#383838"/>
          <ellipse cx="187" cy="247" rx="6" ry="7" fill="#00ffd1" opacity="0.04"/>
          <line x1="176" y1="272" x2="205" y2="258" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round"/>
          <line x1="196" y1="276" x2="225" y2="262" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round"/>
          <ellipse cx="207" cy="257" rx="5" ry="3" fill="#252525" transform="rotate(-20 207 257)"/>
          <ellipse cx="227" cy="261" rx="5" ry="3" fill="#252525" transform="rotate(-20 227 261)"/>
          <polygon points="202,258 264,226 272,230 210,262" fill="#161616" stroke="#262626" strokeWidth="0.8"/>
          <line x1="207" y1="255" x2="269" y2="224" stroke="#222" strokeWidth="0.5"/>
          <line x1="207" y1="258" x2="269" y2="227" stroke="#222" strokeWidth="0.5"/>
          <polygon points="270,242 310,220 314,222 274,244" fill="#161616" stroke="#262626" strokeWidth="0.8"/>
          <polygon points="270,242 268,218 308,196 310,220" fill="#0d1520" stroke="#4488ff" strokeWidth="1"/>
          <line x1="270" y1="232" x2="305" y2="213" stroke="#4488ff" strokeWidth="0.8" opacity="0.6"/>
          <line x1="270" y1="237" x2="305" y2="218" stroke="#4488ff" strokeWidth="0.6" opacity="0.4"/>
          <circle cx="195" cy="165" r="5" fill="#00ffd1" opacity="0.9"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></circle>
          <circle cx="195" cy="165" r="9" fill="none" stroke="#00ffd1" strokeWidth="0.5" opacity="0.4"><animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/></circle>
          <line x1="195" y1="170" x2="205" y2="182" stroke="#00ffd1" strokeWidth="0.6" opacity="0.4"/>
          <circle cx="230" cy="145" r="4" fill="#4488ff" opacity="0.9"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" begin="0.5s"/></circle>
          <line x1="230" y1="149" x2="225" y2="175" stroke="#4488ff" strokeWidth="0.6" opacity="0.35"/>
          <circle cx="175" cy="140" r="3" fill="#00d1ac" opacity="0.8"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="1s"/></circle>
          <path d="M195,165 Q212,152 230,145 Q215,138 175,140" stroke="#00ffd1" strokeWidth="0.5" fill="none" opacity="0.2" strokeDasharray="3,3"><animate attributeName="strokeDashoffset" values="0;-12" dur="2s" repeatCount="indefinite"/></path>
          <ellipse cx="220" cy="396" rx="100" ry="8" fill="#00ffd1" opacity="0.03"/>
        </svg>
      </div>

      {/* TWEAKED BRANDING TEXT FOR LOGIN */}
      <div className="branding">
        <div className="logo-row">
          <Code2 size={44} className="logo-icon" />
          <span className="logo-tag">MonolithMapper</span>
        </div>
        <div className="headline">
          <h1>Access Your<br /><span className="hl"><u>Workspace</u></span></h1>
        </div>
        <p className="sub">Welcome back. Authenticate to continue analyzing and modernizing your codebase.</p>
        
        {/* We can remove the pills for login, makes it cleaner */}
      </div>

      <div className="status-bar">
        <div className="status-dot" style={{ background: "#4488ff", boxShadow: "0 0 6px #4488ff" }}/>
        <span>AWAITING AUTHENTICATION · SECURE CONNECTION ESTABLISHED</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RIGHT PANEL — LOGIN FORM
───────────────────────────────────────────── */
function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1500));
    // Usually here you'd redirect to dashboard
    navigate('/'); 
  };

  return (
    <div className="form-card">
      <svg className="corner-deco" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <line x1="0" y1="16" x2="48" y2="16" stroke="#00ffd1" strokeWidth="0.5"/>
        <line x1="0" y1="32" x2="48" y2="32" stroke="#00ffd1" strokeWidth="0.5"/>
        <line x1="16" y1="0" x2="16" y2="48" stroke="#00ffd1" strokeWidth="0.5"/>
        <line x1="32" y1="0" x2="32" y2="48" stroke="#00ffd1" strokeWidth="0.5"/>
        <rect x="14" y="14" width="4" height="4" fill="#00ffd1"/>
      </svg>

      <button className="auth-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={14} /> Back to terminal
      </button>

      <div className="form-header">
        <div className="step-badge">System Access</div>
        <h2>Sign in to Monolith</h2>
        <p>Don't have an account? <a href="/signup">Create one here</a></p>
      </div>

      <div className="oauth-row">
        <button className="oauth-btn" type="button">
          <GitBranch size={16} /> GitHub
        </button>
        <button className="oauth-btn" type="button">
          <Globe size={16} /> Google 
        </button>
      </div>

      <div className="divider"><span>or continue with email</span></div>

      <div className="field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          type="email"
          placeholder="ada@company.dev"
          value={form.email}
          onChange={handleChange("email")}
        />
      </div>

      <div className="field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
          <a href="#" style={{ fontSize: '11px', color: 'var(--cyan)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>Forgot?</a>
        </div>
        <div className="input-wrap">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••••••"
            value={form.password}
            onChange={handleChange("password")}
            className="has-toggle"
          />
          <button className="toggle-vis" type="button" onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={status === "loading" || !form.email || !form.password}
        type="button"
        style={{ marginTop: '24px' }}
      >
        {status === "loading" ? (
          <><Loader2 size={16} className="spinning" /> Authenticating…</>
        ) : (
          <>Sign In <ArrowRight size={16} /></>
        )}
      </button>
    </div>
  );
}

export default function Login() {
  return (
    // Yahan humne .login-page class add ki hai reverse layout ke liye
    <div className="auth-page login-page">
      <VisualPanel />
      <div className="right-panel">
        <LoginForm />
      </div>
    </div>
  );
}