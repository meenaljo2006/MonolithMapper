import { useState } from "react";
import { Code2, Eye, EyeOff, ArrowRight, ArrowLeft, GitBranch, Globe, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import "./authentication.css"; // Cleanly imported CSS
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   LEFT PANEL — visual branding
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   LIVE PIPELINE ACTIVITY (Meaningful Animation)
───────────────────────────────────────────── */
const PIPELINE_LOGS = [
  { agent: "PARSER", msg: "Extracting AST from legacy_router.java", color: "#00ffd1" },
  { agent: "GRAPH", msg: "Embedding 1,204 new nodes to vector DB", color: "#4488ff" },
  { agent: "RETRIEVER", msg: "Scanning cross-file dependencies", color: "#00d1ac" },
  { agent: "GUARDRAIL", msg: "Syntax validation passed (12ms)", color: "#ff8844" },
  { agent: "GENERATOR", msg: "Modernizing monolithic_auth.py", color: "#b388ff" },
  { agent: "EVALUATOR", msg: "Quality score: 99.4% - Success", color: "#00ffd1" },
  { agent: "SYSTEM", msg: "Knowledge graph sync complete", color: "#4488ff" },
  { agent: "PARSER", msg: "Mapping legacy_payment_gateway.js", color: "#00ffd1" },
  { agent: "GUARDRAIL", msg: "Hallucination risk: 0.0%", color: "#ff8844" },
  { agent: "RETRIEVER", msg: "Context retrieved in 45ms", color: "#00d1ac" }
];

function ActivityStream() {
  // We duplicate the logs to create a seamless infinite scrolling loop
  const infiniteLogs = [...PIPELINE_LOGS, ...PIPELINE_LOGS];

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

function LeftPanel() {
  return (
    <div className="left-panel">
      <div className="noise" />
      <div className="scanlines" />
      <div className="orb orb-cyan" />
      <div className="orb orb-blue" />

      {/* Glow lines */}
      <div className="glow-line" style={{ width:180, bottom:230, right:100, animationDelay:"0s" }} />
      <div className="glow-line" style={{ width:120, bottom:280, right:180, animationDelay:"1.5s" }} />
      <div className="glow-line" style={{ width: 90, bottom:310, right:260, animationDelay:"3s" }} />

      <ActivityStream />

      {/* Isometric SVG scene */}
      <div style={{ position:"absolute", bottom:0, right:-20, width:440, height:420, zIndex:3, pointerEvents:"none" }}>
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
          {/* floating nodes */}
          <circle cx="195" cy="165" r="5" fill="#00ffd1" opacity="0.9">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="195" cy="165" r="9" fill="none" stroke="#00ffd1" strokeWidth="0.5" opacity="0.4">
            <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <line x1="195" y1="170" x2="205" y2="182" stroke="#00ffd1" strokeWidth="0.6" opacity="0.4"/>
          <circle cx="230" cy="145" r="4" fill="#4488ff" opacity="0.9">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
          <line x1="230" y1="149" x2="225" y2="175" stroke="#4488ff" strokeWidth="0.6" opacity="0.35"/>
          <circle cx="175" cy="140" r="3" fill="#00d1ac" opacity="0.8">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="1s"/>
          </circle>
          <path d="M195,165 Q212,152 230,145 Q215,138 175,140" stroke="#00ffd1" strokeWidth="0.5" fill="none" opacity="0.2" strokeDasharray="3,3">
            <animate attributeName="strokeDashoffset" values="0;-12" dur="2s" repeatCount="indefinite"/>
          </path>
          <ellipse cx="220" cy="396" rx="100" ry="8" fill="#00ffd1" opacity="0.03"/>
        </svg>
      </div>

      {/* Branding */}
      <div className="branding">
        <div className="logo-row">
          <Code2 size={44} className="logo-icon" />
          <span className="logo-tag">MonolithMapper</span>
        </div>
        <div className="headline">
          <h1>Master Your<br /><span className="hl"><u>Monolith</u></span></h1>
        </div>
        <p className="sub">Join thousands of engineers modernizing their legacy codebases with AI.</p>
        <div className="pills">
          <div className="pill"><div className="pill-dot" />Agentic Workflow</div>
          <div className="pill"><div className="pill-dot" style={{animationDelay:".4s"}} />Context Aware</div>
          <div className="pill"><div className="pill-dot" style={{animationDelay:".8s"}} />AST Precision</div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-dot" />
        <span>SYSTEM ONLINE · v1.0.1 · 12,847 codebases mapped</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PASSWORD STRENGTH
───────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, Math.ceil(score * 4 / 5));
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_CLASSES = ["", "active-weak", "active-fair", "active-good", "active-strong"];

function PasswordStrength({ password }) {
  const level = getStrength(password);
  if (!password) return null;
  return (
    <div>
      <div className="strength-bar">
        {[1,2,3,4].map(i => (
          <div key={i} className={`strength-seg ${i <= level ? STRENGTH_CLASSES[level] : ""}`} />
        ))}
      </div>
      <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color: level <= 1 ? "#ff4466" : level <= 2 ? "#ffaa00" : "var(--cyan-muted)", marginTop:4 }}>
        {STRENGTH_LABELS[level]}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RIGHT PANEL — SIGNUP FORM
───────────────────────────────────────────── */
function SignupForm() {
  const [form, setForm]       = useState({ firstName:"", lastName:"", email:"", password:"", agreed: false });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [status, setStatus]   = useState("idle");
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.password || form.password.length < 8)
      e.password = "Min 8 characters";
    if (!form.agreed)
      e.agreed = "You must accept the terms";
    return e;
  };

  const handleChange = (field) => (e) => {
    const val = field === "agreed" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(er => { const n = {...er}; delete n[field]; return n; });
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1600));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="success-screen">
        <div className="check-ring">
          <CheckCircle2 size={28} color="#00ffd1" />
        </div>
        <h3>Account Created</h3>
        <p>Welcome aboard, {form.firstName}. Check your inbox to verify your email before diving in.</p>
        <div className="mono-note">→ {form.email}</div>
        <button className="submit-btn" style={{ marginTop:8 }}
          onClick={() => setStatus("idle")}>
          Open Dashboard <ArrowRight size={16} />
        </button>
      </div>
    );
  }

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
        <div className="step-badge">New account</div>
        <h2>Create your workspace</h2>
        <p>Already have one? <a href="/login">Sign in instead</a></p>
      </div>

      <div className="oauth-row">
        <button className="oauth-btn" type="button">
          <GitBranch size={16} /> GitHub
        </button>
        <button className="oauth-btn" type="button">
          {/* Swapped Chrome for Globe to fix Vite Error */}
          <Globe size={16} /> Google 
        </button>
      </div>

      <div className="divider"><span>or continue with email</span></div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            placeholder="Ada"
            value={form.firstName}
            onChange={handleChange("firstName")}
            className={errors.firstName ? "error" : ""}
          />
          {errors.firstName && (
            <div className="field-error"><AlertCircle size={10} />{errors.firstName}</div>
          )}
        </div>
        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            placeholder="Lovelace"
            value={form.lastName}
            onChange={handleChange("lastName")}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && (
            <div className="field-error"><AlertCircle size={10} />{errors.lastName}</div>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          type="email"
          placeholder="ada@company.dev"
          value={form.email}
          onChange={handleChange("email")}
          className={errors.email ? "error" : ""}
        />
        {errors.email && (
          <div className="field-error"><AlertCircle size={10} />{errors.email}</div>
        )}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="input-wrap">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange("password")}
            className={`has-toggle ${errors.password ? "error" : ""}`}
          />
          <button className="toggle-vis" type="button" onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <PasswordStrength password={form.password} />
        {errors.password && (
          <div className="field-error"><AlertCircle size={10} />{errors.password}</div>
        )}
      </div>

      <div className="terms-row">
        <input
          type="checkbox"
          id="terms"
          checked={form.agreed}
          onChange={handleChange("agreed")}
        />
        <label htmlFor="terms">
          I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </label>
      </div>
      {errors.agreed && (
        <div className="field-error" style={{ marginBottom:12, marginTop:-8 }}>
          <AlertCircle size={10} />{errors.agreed}
        </div>
      )}

      <button
        className={`submit-btn ${status === "success" ? "success-state" : ""}`}
        onClick={handleSubmit}
        disabled={status === "loading" || !form.agreed}
        type="button"
      >
        {status === "loading" ? (
          <><Loader2 size={16} className="spinning" /> Creating workspace…</>
        ) : (
          <>Create account <ArrowRight size={16} /></>
        )}
      </button>
    </div>
  );
}

export default function Signup() {
  return (
    <div className="auth-page">
      <LeftPanel />
      <div className="right-panel">
        <SignupForm />
      </div>
    </div>
  );
}