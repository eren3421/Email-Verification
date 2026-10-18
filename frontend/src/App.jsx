import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

const CURRENT_YEAR = new Date().getFullYear();

async function request(path, options = {}) {
  const response = await fetch(`/api/auth${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Bir sorun oluştu. Lütfen tekrar dene.");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function Icon({ name, size = 18, ...props }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  const drawings = {
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.5 15.5 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1 0 1.9-.2 2.8-.5" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    arrowLeft: <><path d="M19 12H5m6 6-6-6 6-6" /></>,
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    laptop: <><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M2 20h20m-13-4-1 4m7-4 1 4" /></>,
    key: <><circle cx="8" cy="15" r="5" /><path d="m11.5 11.5 8-8L22 6l-2 2 1 1-3 3-1-1-2 2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    arrowUpRight: <><path d="M7 17 17 7M7 7h10v10" /></>,
    sparkleTiny: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...shared} {...props}>{drawings[name] || drawings.sparkle}</svg>;
}

function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand${light ? " brand-light" : ""}`} aria-label="Nora ana sayfa">
      <span className="brand-mark"><Icon name="shield" size={18} /></span>
      <span>Nora<span className="brand-dot">.</span></span>
    </Link>
  );
}

function AuthVisual() {
  return (
    <aside className="auth-visual" aria-label="Nora güvenlik özellikleri">
      <span className="visual-orb orb-one" /><span className="visual-orb orb-two" />
      <div className="visual-top">
        <Brand light />
        <span className="visual-index"><span /> 01 / 03</span>
      </div>
      <div className="visual-copy">
        <p className="visual-overline">DİJİTAL HAYATIN İÇİN</p>
        <h2>Güvenliğin,<br />için <em>önceliğimiz.</em></h2>
        <p className="visual-description">Hesabını korumak için tasarlanmış sade ve güvenilir bir deneyim.</p>
      </div>
      <div className="visual-art" aria-hidden="true">
        <span className="art-ring" /><span className="art-ring ring-front" />
        <span className="art-orbit" /><span className="art-orbit orbit-b" />
        <div className="floating-badge"><span><Icon name="check" size={11} /></span> Uçtan uca koruma</div>
        <div className="security-card">
          <span className="security-icon"><Icon name="shield" size={21} /></span>
          <span className="security-card-copy"><span>HESAP DURUMU</span><strong>Hesabın güvende</strong></span>
          <span className="secure-check"><Icon name="check" size={13} /></span>
        </div>
        <div className="device-card">
          <span className="device-icon"><Icon name="laptop" size={15} /></span>
          <span><b>Yeni oturum</b><small>Bu cihaz · Şimdi</small></span><i />
        </div>
      </div>
      <div className="visual-bottom">
        <div className="avatar-stack"><span>N</span><span>A</span><span>+</span></div>
        <p>Bilgilerin <strong>her zaman sana ait.</strong></p>
        <div className="visual-pagination" aria-hidden="true"><i className="active" /><i /><i /></div>
      </div>
    </aside>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <main className="auth-shell">
        <section className="auth-form-side">
          <header className="auth-topline">
            <Brand />
            <span className="topline-note"><i className="status-dot" /> Güvenli oturum</span>
          </header>
          <div className="form-wrap">{children}</div>
          <footer className="auth-footer">
            <span>© {CURRENT_YEAR} Nora</span>
            <span>Gizliliğin önceliğimizdir</span>
          </footer>
        </section>
        <AuthVisual />
      </main>
    </div>
  );
}

function Heading({ eyebrow = "HESAP GÜVENLİĞİ", title, children, compact = false }) {
  return (
    <div className={compact ? "compact-heading" : "form-heading"}>
      <span className="eyebrow"><i className="eyebrow-line" />{eyebrow}</span>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}

function Field({ id, label, icon, type = "text", ...props }) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="field-shell">
        <Icon className="field-icon" name={icon} size={17} />
        <input id={id} type={type} {...props} />
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete, minLength }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="field-shell">
        <Icon className="field-icon" name="lock" size={17} />
        <input id={id} type={visible ? "text" : "password"} value={value} onChange={onChange} placeholder="••••••••" autoComplete={autoComplete} minLength={minLength} required />
        <button className="field-action" type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Parolayı gizle" : "Parolayı göster"}>
          <Icon name={visible ? "eyeOff" : "eye"} size={17} />
        </button>
      </div>
    </div>
  );
}

function FormMessage({ children, success = false }) {
  if (!children) return null;
  return <div className={success ? "success-message" : "form-message"} role="status"><span>{success ? <Icon name="check" size={12} /> : "!"}</span>{children}</div>;
}

function SubmitButton({ children, busy, icon = "arrow" }) {
  return <button className="primary-button" type="submit" disabled={busy}>{busy ? <><span className="spinner" /> Lütfen bekle</> : <>{children}<Icon name={icon} size={17} /></>}</button>;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(location.state?.message || "");
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNeedsVerification(false);
    try {
      await request("/login", { method: "POST", body: JSON.stringify({ email, password }) });
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
      setNeedsVerification(Boolean(submitError.data?.requiresVerification));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <Heading title="Tekrar hoş geldin">Hesabına güvenle erişmek için bilgilerini gir.</Heading>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Field id="login-email" label="E-posta adresi" icon="mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@email.com" autoComplete="email" required />
        <div>
          <PasswordField id="login-password" label="Parola" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          <Link className="text-link forgot-link" to="/forgot-password">Parolamı unuttum</Link>
        </div>
        <FormMessage>{error}</FormMessage>
        {needsVerification && <p className="field-hint">Kod e-postana gönderilmiş olmalı. <Link className="text-link" to="/verify-email" state={{ email }}>Doğrulamaya git</Link></p>}
        <SubmitButton busy={busy}>Giriş yap</SubmitButton>
        <div className="form-divider"><span>İlk kez mi buradasın?</span></div>
        <p className="switch-prompt">Nora hesabın yok mu? <Link to="/signup">Hemen oluştur <Icon name="arrow" size={13} /></Link></p>
      </form>
      <div className="form-assurance"><Icon name="shield" size={14} /> Bilgilerin şifrelenerek korunur</div>
    </AuthLayout>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
      sessionStorage.setItem("nora-verification-email", email);
      navigate("/verify-email", { state: { email } });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <Heading title="Hesabını oluştur">Nora ile dijital dünyanda daha güvende ol.</Heading>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Field id="signup-name" label="Ad soyad" icon="user" value={name} onChange={(event) => setName(event.target.value)} placeholder="Adın ve soyadın" autoComplete="name" required />
        <Field id="signup-email" label="E-posta adresi" icon="mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@email.com" autoComplete="email" required />
        <PasswordField id="signup-password" label="Parola" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} />
        <p className="field-hint">En az 8 karakter kullan.</p>
        <FormMessage>{error}</FormMessage>
        <SubmitButton busy={busy}>Hesap oluştur</SubmitButton>
        <p className="switch-prompt">Zaten hesabın var mı? <Link to="/login">Giriş yap <Icon name="arrow" size={13} /></Link></p>
      </form>
      <div className="form-assurance"><Icon name="shield" size={14} /> Kaydolarak güvenli kullanım koşullarını kabul edersin</div>
    </AuthLayout>
  );
}

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(() => location.state?.email || sessionStorage.getItem("nora-verification-email") || "");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("/verify-email", { method: "POST", body: JSON.stringify({ code }) });
      sessionStorage.removeItem("nora-verification-email");
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <div className="step-icon"><Icon name="mail" size={21} /></div>
      <Heading compact eyebrow="E-POSTA DOĞRULAMA" title="Gelen kutunu kontrol et">
        {email ? <><strong>{email}</strong> adresine 6 haneli bir kod gönderdik.</> : "E-posta adresine gönderdiğimiz 6 haneli kodu gir."}
      </Heading>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Field id="verification-code" label="Doğrulama kodu" icon="key" type="text" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required />
        <p className="verify-tip"><Icon name="clock" size={14} /> Kod 24 saat boyunca geçerlidir.</p>
        <FormMessage>{error}</FormMessage>
        <SubmitButton busy={busy}>E-postamı doğrula</SubmitButton>
        <p className="switch-prompt">Kod görünmüyor mu? Spam klasörünü kontrol et.</p>
        <p className="switch-prompt"><Link to="/signup"><Icon name="arrowLeft" size={13} /> Bilgileri düzenle</Link></p>
      </form>
    </AuthLayout>
  );
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      setSent(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <div className="step-icon"><Icon name={sent ? "checkCircle" : "key"} size={21} /></div>
      <Heading compact eyebrow="PAROLA YENİLEME" title={sent ? "Gelen kutunu kontrol et" : "Parolanı mı unuttun?"}>
        {sent ? <>Yenileme bağlantısını <strong>{email}</strong> adresine gönderdik. Bağlantı 1 saat geçerlidir.</> : "Hesabına bağlı e-posta adresini yaz; sana parola yenileme bağlantısı gönderelim."}
      </Heading>
      {!sent ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <Field id="forgot-email" label="E-posta adresi" icon="mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@email.com" autoComplete="email" required />
          <FormMessage>{error}</FormMessage>
          <SubmitButton busy={busy}>Bağlantı gönder</SubmitButton>
        </form>
      ) : <div className="success-message"><span><Icon name="check" size={12} /></span> Gelen kutunu ve spam klasörünü kontrol et.</div>}
      <p className="switch-prompt back-link"><Link to="/login"><Icon name="arrowLeft" size={13} /> Girişe dön</Link></p>
    </AuthLayout>
  );
}

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Girdiğin parolalar eşleşmiyor.");
      return;
    }
    setBusy(true);
    try {
      await request(`/reset-password/${encodeURIComponent(token)}`, { method: "POST", body: JSON.stringify({ password }) });
      navigate("/login", { replace: true, state: { message: "Parolan yenilendi. Yeni parolanla giriş yapabilirsin." } });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <div className="step-icon"><Icon name="lock" size={21} /></div>
      <Heading compact eyebrow="YENİ PAROLA" title="Yeni parolanı belirle">Hesabını korumak için güçlü ve daha önce kullanmadığın bir parola seç.</Heading>
      <form className="auth-form" onSubmit={handleSubmit}>
        <PasswordField id="new-password" label="Yeni parola" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} />
        <PasswordField id="confirm-password" label="Yeni parola tekrar" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} />
        <FormMessage>{error}</FormMessage>
        <SubmitButton busy={busy}>Parolayı yenile</SubmitButton>
      </form>
    </AuthLayout>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    request("/check-auth")
      .then((data) => { if (active) setUser(data.user); })
      .catch(() => { if (active) navigate("/login", { replace: true }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      await request("/logout", { method: "POST" });
      navigate("/login", { replace: true });
    } catch (logoutError) {
      setError(logoutError.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) return <div className="loading-screen"><span className="spinner spinner-dark" /><p>Hesabın kontrol ediliyor…</p></div>;
  const createdAt = user.createdAt ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date(user.createdAt)) : "—";
  const lastLogin = user.lastLogin ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(user.lastLogin)) : "Bu oturum";

  return (
    <div className="dashboard-page">
      <main className="dashboard-shell">
        <nav className="dashboard-nav">
          <Brand />
          <div className="dashboard-nav-right">
            <span className="topline-note"><i className="status-dot" /> Hesabın güvende</span>
            <button className="logout-button" type="button" onClick={handleLogout} disabled={busy}>{busy ? <span className="spinner spinner-dark" /> : <Icon name="logout" size={16} />} Çıkış yap</button>
          </div>
        </nav>
        <section className="dashboard-content">
          <span className="eyebrow"><i className="eyebrow-line" /> KİŞİSEL ALANIN</span>
          <div className="dashboard-title-row">
            <div><h1>Merhaba, <span className="title-period">{user.name?.split(" ")[0] || ""}.</span></h1><p>Hesabın hazır ve güvende. İyi ki buradasın.</p></div>
            <div className="user-avatar" aria-hidden="true">{user.name?.trim()?.[0]?.toUpperCase() || "N"}</div>
          </div>
          {error && <FormMessage>{error}</FormMessage>}
          <div className="dashboard-grid">
            <article className="welcome-card">
              <span className="welcome-icon"><Icon name="sparkle" size={18} /></span>
              <span className="card-overline">NORA'YA HOŞ GELDİN</span>
              <h2>Dijital dünyanda<br />için rahat olsun.</h2>
              <p>Hesabın e-posta doğrulamasıyla korunuyor. Güvenli deneyimin şimdi başladı.</p>
              <span className="welcome-decoration"><Icon name="shield" size={142} /></span>
            </article>
            <article className="account-card">
              <div className="account-card-heading"><span className="account-icon"><Icon name="user" size={16} /></span> Hesap bilgileri <span className="verified-pill"><Icon name="check" size={10} /> DOĞRULANDI</span></div>
              <div className="account-row"><span>Ad soyad</span><strong>{user.name}</strong></div>
              <div className="account-row"><span>E-posta</span><strong>{user.email}</strong></div>
              <div className="account-row"><span>Hesap durumu</span><span className="account-status"><i /> Aktif</span></div>
              <div className="account-bottom"><Icon name="clock" size={13} /> Üyelik başlangıcı: {createdAt}</div>
            </article>
          </div>
          <div className="security-note">
            <span className="security-note-icon"><Icon name="shield" size={17} /></span>
            <div><strong>Hesabın koruma altında</strong><p>Son giriş: {lastLogin}</p></div>
            <span className="account-status"><i /> Güvenli</span>
          </div>
        </section>
        <footer className="dashboard-footer"><Brand /><span>Güvenli dijital deneyim, Nora ile.</span></footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
