
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      </section>
    </main>
  );
}
