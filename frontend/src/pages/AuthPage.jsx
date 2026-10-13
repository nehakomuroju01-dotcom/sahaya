
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetStatus, setResetStatus] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "DONOR",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillAccount = (email, password) => {
    setForm((prev) => ({ ...prev, email, password }));
    setError("");
    setResetStatus("");
  };

  const handleResetDemoData = async () => {
    try {
      setResetStatus("Resetting demo data...");
      await api.post("/demo/reset");
      setResetStatus("✓ Demo data reset & seeded fresh!");
      setTimeout(() => setResetStatus(""), 4000);
    } catch {
      setResetStatus("Failed to reset demo data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register({
  name: form.fullName.trim(),
  email: form.email.trim(),
  password: form.password,
  phone: form.phone.trim(),
  role: form.role,
});
      }

      navigate("/feed", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === "string"
          ? data
          : data?.message || "Unable to continue. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="form-card auth-card">
        <p className="eyebrow">WELCOME TO SAHAYA</p>
        <h1>{isLogin ? "Welcome back." : "A little good starts here."}</h1>
        <p className="subtitle">
          {isLogin
            ? "Log in to continue sharing good things."
            : "Create an account and help your community."}
        </p>

        <div className="type-switch">
          <button
            type="button"
            className={`btn ${isLogin ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            className={`btn ${!isLogin ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label htmlFor="fullName">Full name *</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />

              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

              <label htmlFor="role">I am a...</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="DONOR">Donor</option>
                <option value="RECEIVER_ORG">Receiver organization</option>
                <option value="VOLUNTEER">Volunteer</option>
              </select>
            </>
          )}

          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn btn-primary submit-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Log in →"
                : "Create account →"}
          </button>
        </form>

        {isLogin && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                🎓 Presentation Demo Accounts
              </span>
              <button
                type="button"
                onClick={handleResetDemoData}
                style={{ fontSize: "0.75rem", background: "none", border: "none", color: "#0f766e", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}
              >
                ↺ Reset Database
              </button>
            </div>
            {resetStatus && (
              <p style={{ fontSize: "0.8rem", color: resetStatus.startsWith("✓") ? "#16a34a" : "#dc2626", margin: "0 0 0.5rem 0", fontWeight: 500 }}>
                {resetStatus}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("taj.banquets@gmail.com", "password123")}>
                🍱 Donor: Taj Banquets
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("rohan.verma@gmail.com", "password123")}>
                🧥 Donor: Rohan Verma
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("aashray.shelter@gmail.com", "password123")}>
                🏠 Receiver: Aashray Shelter
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("karuna.rescue@gmail.com", "password123")}>
                🐾 Receiver: Karuna Shelter
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("aarav.volunteer@gmail.com", "password123")}>
                🚴 Volunteer: Aarav
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("sneha.volunteer@gmail.com", "password123")}>
                📦 Volunteer: Sneha
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "4px 8px" }} onClick={() => fillAccount("admin@sahaya.com", "admin12345678")}>
                🛡️ Admin: Sahaya
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
