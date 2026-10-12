import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function VolunteerMissions() {
  const [tab, setTab] = useState("available");
  const [availableMissions, setAvailableMissions] = useState([]);
  const [myMissions, setMyMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [handoverCodes, setHandoverCodes] = useState({});

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [availRes, myRes] = await Promise.all([
        api.get("/missions/available"),
        api.get("/missions/my"),
      ]);
      setAvailableMissions(Array.isArray(availRes.data) ? availRes.data : []);
      setMyMissions(Array.isArray(myRes.data) ? myRes.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load missions. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAccept(missionId) {
    try {
      setActionLoadingId(missionId);
      setError("");
      setMessage("");
      await api.put(`/missions/${missionId}/accept`);
      setMessage(`Mission #${missionId} accepted! Check "My Missions" to manage it.`);
      await loadData();
      setTab("my");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept mission.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleMarkPickedUp(missionId) {
    try {
      setActionLoadingId(missionId);
      setError("");
      setMessage("");
      await api.put(`/missions/${missionId}/picked-up`);
      setMessage(`Mission #${missionId} marked as picked up!`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update mission status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleGetHandoverCode(missionId) {
    try {
      setActionLoadingId(missionId);
      const res = await api.get(`/missions/${missionId}/handover-code`);
      setHandoverCodes((prev) => ({
        ...prev,
        [missionId]: res.data?.handoverCode,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch handover code.");
    } finally {
      setActionLoadingId(null);
    }
  }

  const activeMissionsList = tab === "available" ? availableMissions : myMissions;

  return (
    <main className="page-container" style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ marginBottom: "30px" }}>
        <p style={{ color: "var(--burgundy)", fontWeight: 600, letterSpacing: "1px", margin: 0 }}>
          SAHAYA / VOLUNTEER
        </p>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.4rem", margin: "8px 0" }}>
          Delivery Missions
        </h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Help pick up surplus donations and deliver them to shelters in need.
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => { setTab("available"); setMessage(""); }}
          className={`btn ${tab === "available" ? "btn-primary" : "btn-secondary"}`}
        >
          Available Missions ({availableMissions.length})
        </button>
        <button
          type="button"
          onClick={() => { setTab("my"); setMessage(""); }}
          className={`btn ${tab === "my" ? "btn-primary" : "btn-secondary"}`}
        >
          My Missions ({myMissions.length})
        </button>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ background: "#f0fdf4", color: "#15803d", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          {message}
        </div>
      )}

      {loading && <p>Loading missions...</p>}

      {!loading && activeMissionsList.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--paper)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <h3 style={{ margin: "0 0 8px 0" }}>
            {tab === "available" ? "No available missions right now" : "You have no active missions"}
          </h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            {tab === "available"
              ? "When shelters request transport assistance for their claimed donations, tasks will appear here."
              : "Switch to 'Available Missions' to accept a task and help someone today!"}
          </p>
        </div>
      )}

      {!loading && activeMissionsList.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {activeMissionsList.map((m) => (
            <article
              key={m.id}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px 24px",
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600 }}>
                    MISSION #{m.id}
                  </span>
                  <h3 style={{ margin: "4px 0", fontSize: "1.3rem" }}>
                    {m.donationTitle || "Donation Pickup"}
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
                    Delivering to: <strong style={{ color: "#34251f" }}>{m.receiverName || "Shelter"}</strong>
                  </p>
                </div>

                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    background: m.status === "COMPLETED" ? "#dcfce7" : m.status === "ACCEPTED" ? "#e0f2fe" : "#fef3c7",
                    color: m.status === "COMPLETED" ? "#166534" : m.status === "ACCEPTED" ? "#075985" : "#854d0e",
                  }}
                >
                  {m.status}
                </span>
              </div>

              <div style={{ display: "flex", gap: "24px", fontSize: "0.9rem", color: "var(--muted)", marginBottom: "16px" }}>
                <div>
                  Quantity: <strong style={{ color: "#34251f" }}>{m.donationQuantity ?? "—"}</strong>
                </div>
                <div>
                  Donation ID: <Link to={`/donations/${m.donationId}`} style={{ color: "var(--burgundy)", textDecoration: "underline" }}>#{m.donationId}</Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                {tab === "available" && m.status === "AVAILABLE" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={actionLoadingId === m.id}
                    onClick={() => handleAccept(m.id)}
                  >
                    {actionLoadingId === m.id ? "Accepting..." : "Accept Mission"}
                  </button>
                )}

                {tab === "my" && m.status === "ACCEPTED" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={actionLoadingId === m.id}
                    onClick={() => handleMarkPickedUp(m.id)}
                  >
                    {actionLoadingId === m.id ? "Updating..." : "Mark as Picked Up"}
                  </button>
                )}

                {tab === "my" && m.status === "PICKED_UP" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={actionLoadingId === m.id}
                      onClick={() => handleGetHandoverCode(m.id)}
                    >
                      {actionLoadingId === m.id ? "Fetching..." : "Show Handover Code"}
                    </button>

                    {handoverCodes[m.id] && (
                      <span style={{ background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "2px" }}>
                        Code: {handoverCodes[m.id]}
                      </span>
                    )}
                  </div>
                )}

                {m.status === "COMPLETED" && (
                  <span style={{ color: "#166534", fontWeight: 600, fontSize: "0.95rem" }}>
                    ✓ Delivery completed and verified!
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
