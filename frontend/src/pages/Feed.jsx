import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import CountdownBadge from "../components/CountdownBadge";
import DonationMap from "../components/DonationMap";

function CategoryLabel({ type }) {
  return (
    <span
      className={`type-pill ${
        type === "FOOD" ? "food-pill" : "goods-pill"
      }`}
    >
      {type === "FOOD" ? "FOOD" : "ESSENTIALS"}
    </span>
  );
}

export default function Feed() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [impact, setImpact] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "map"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Create Need Modal state
  const [showNeedModal, setShowNeedModal] = useState(false);
  const [needForm, setNeedForm] = useState({
    title: "",
    description: "",
    type: "FOOD",
    quantity: 1,
    location: "",
  });
  const [needSubmitting, setNeedSubmitting] = useState(false);
  const [needMessage, setNeedMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [donationsRes, impactRes, needsRes] = await Promise.all([
        api.get("/donations").catch(() => ({ data: [] })),
        api.get("/impact/summary").catch(() => ({ data: null })),
        api.get("/needs").catch(() => ({ data: [] })),
      ]);

      setDonations(Array.isArray(donationsRes.data) ? donationsRes.data : []);
      setImpact(impactRes.data || null);
      setNeeds(Array.isArray(needsRes.data) ? needsRes.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't load donations. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateNeed(e) {
    e.preventDefault();
    try {
      setNeedSubmitting(true);
      setNeedMessage("");
      const res = await api.post("/needs", {
        ...needForm,
        quantity: Number(needForm.quantity),
      });
      setNeeds((prev) => [res.data, ...prev]);
      setShowNeedModal(false);
      setNeedForm({
        title: "",
        description: "",
        type: "FOOD",
        quantity: 1,
        location: "",
      });
      setFilter("NEEDS");
    } catch (err) {
      setNeedMessage(err.response?.data?.message || "Failed to post need request.");
    } finally {
      setNeedSubmitting(false);
    }
  }

  const visibleDonations =
    filter === "ALL"
      ? donations
      : donations.filter(
          (item) => (item.type || "").toUpperCase() === filter
        );

  const filters = [
    { value: "ALL", label: "All donations" },
    { value: "FOOD", label: "Food" },
    { value: "GOODS", label: "Essentials" },
    { value: "NEEDS", label: `Shelter Needs (${needs.length})` },
  ];

  return (
    <main className="page-container feed-page">
      <section className="feed-hero">
        <p className="eyebrow">SMALL ACTS. REAL IMPACT.</p>
        <h1>Good things find their way.</h1>
        <p className="subtitle">
          A little extra in your hands can mean a lot to someone else.
          Discover food and essentials shared by your community.
        </p>
        <a href="#community-board" className="hero-link">
          Explore donations <span aria-hidden="true">→</span>
        </a>
      </section>

      {/* Live Impact Stats Banner */}
      {impact && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            background: "var(--paper)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px",
            margin: "0 0 36px 0",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "var(--burgundy)",
                margin: 0,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {impact.totalDonations ?? 0}
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "4px 0 0 0",
                fontWeight: 600,
              }}
            >
              Total Listings
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "var(--green)",
                margin: 0,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {impact.foodDonations ?? 0}
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "4px 0 0 0",
                fontWeight: 600,
              }}
            >
              Food Portions
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "var(--burgundy)",
                margin: 0,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {impact.completedMissions ?? 0}
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "4px 0 0 0",
                fontWeight: 600,
              }}
            >
              Volunteer Deliveries
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "var(--green)",
                margin: 0,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {impact.completedDonations ?? 0}
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "4px 0 0 0",
                fontWeight: 600,
              }}
            >
              Successfully Rescued
            </p>
          </div>
        </section>
      )}

      <section id="community-board" className="community-section">
        <div className="feed-heading">
          <div>
            <p className="eyebrow">THE COMMUNITY BOARD</p>
            <h2>
              {filter === "NEEDS"
                ? "Active Shelter Requests"
                : "Available donations"}
            </h2>
            <p className="section-description">
              {filter === "NEEDS"
                ? "Resources urgently requested by verified shelters and NGOs."
                : "Shared by people. Ready for a second purpose."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Cards vs Map View Toggle */}
            <div
              style={{
                display: "flex",
                background: "var(--cream)",
                padding: "3px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                style={{
                  border: "none",
                  background: viewMode === "cards" ? "var(--burgundy)" : "transparent",
                  color: viewMode === "cards" ? "white" : "var(--muted)",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
              >
                📄 Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                style={{
                  border: "none",
                  background: viewMode === "map" ? "var(--burgundy)" : "transparent",
                  color: viewMode === "map" ? "white" : "var(--muted)",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
              >
                🗺️ City Map
              </button>
            </div>

            <div className="filter-group" aria-label="Filter donations">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`filter-button ${
                    filter === value ? "filter-active" : ""
                  }`}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                >
                  {label}
                  {filter === value && (
                    <span className="filter-dot" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>

            {user?.role === "RECEIVER_ORG" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowNeedModal(true)}
                style={{ padding: "8px 16px", fontSize: "0.9rem" }}
              >
                + Request a Need
              </button>
            )}
          </div>
        </div>

        {/* Interactive Map View */}
        {viewMode === "map" && !loading && (
          <DonationMap donations={visibleDonations} needs={needs} />
        )}

        {loading && (
          <div className="feed-message">
            <span className="loading-line" />
            <p>Finding available items...</p>
          </div>
        )}

        {!loading && error && (
          <div className="feed-message error-message" role="alert">
            <h3>We couldn't load the board.</h3>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={loadData}
              type="button"
            >
              Try again
            </button>
          </div>
        )}

        {/* Shelter Needs View */}
        {!loading && !error && filter === "NEEDS" && (
          <div>
            {needs.length === 0 ? (
              <section className="empty-state">
                <div className="empty-symbol" aria-hidden="true">—</div>
                <h3>No open need requests right now.</h3>
                <p>Shelters haven't posted any urgent resource requests at the moment.</p>
              </section>
            ) : (
              <section className="donation-grid">
                {needs.map((item) => (
                  <article
                    className="donation-card"
                    key={item.id}
                    style={{ borderTop: "4px solid var(--burgundy)" }}
                  >
                    <div className="donation-card-top">
                      <CategoryLabel type={item.type} />
                      <span className="status-pill" style={{ background: "#fef3c7", color: "#854d0e" }}>
                        NEED REQUEST
                      </span>
                    </div>

                    <h3>{item.title}</h3>

                    <p className="donation-description">
                      {item.description || "Urgent shelter requirement."}
                    </p>

                    <div className="quantity-line">
                      <span>Requested quantity</span>
                      <strong>{item.quantity} units</strong>
                    </div>

                    <div className="donation-detail">
                      <span className="detail-label">REQUESTED BY</span>
                      <p style={{ fontWeight: 600 }}>{item.organizationName || "Verified Shelter"}</p>
                    </div>

                    {item.location && (
                      <div className="donation-detail">
                        <span className="detail-label">LOCATION</span>
                        <p>{item.location}</p>
                      </div>
                    )}

                    <div className="card-bottom">
                      <span style={{ fontSize: "0.85rem", color: "var(--burgundy)", fontWeight: 600 }}>
                        Can you help? Post a donation above!
                      </span>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </div>
        )}

        {/* Normal Donations View (Cards Mode) */}
        {!loading && !error && filter !== "NEEDS" && (
          <div>
            <p className="results-count">
              {visibleDonations.length}{" "}
              {visibleDonations.length === 1 ? "listing" : "listings"}
            </p>

            {visibleDonations.length === 0 ? (
              <section className="empty-state">
                <div className="empty-symbol" aria-hidden="true">—</div>
                <h3>Room for something good.</h3>
                <p>
                  {filter === "ALL"
                    ? "No donations have been shared yet. Be the first to contribute."
                    : `There are no ${
                        filter === "FOOD" ? "food" : "essentials"
                      } listings right now.`}
                </p>
                {filter !== "ALL" && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setFilter("ALL")}
                  >
                    View all donations
                  </button>
                )}
              </section>
            ) : (
              <section className="donation-grid">
                {visibleDonations.map((donation) => (
                  <article
                    className="donation-card"
                    key={donation.id}
                    role="link"
                    tabIndex={0}
                    onClick={() =>
                      navigate(`/donations/${donation.id}`, {
                        state: { donation },
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/donations/${donation.id}`, {
                          state: { donation },
                        });
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="donation-card-top">
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        <CategoryLabel type={donation.type} />
                        {donation.type === "FOOD" && (
                          <CountdownBadge expiryDate={donation.expiryDate} />
                        )}
                      </div>
                      <span className="status-pill">
                        {(donation.status || "AVAILABLE").replaceAll("_", " ")}
                      </span>
                    </div>

                    <h3>{donation.title}</h3>

                    <p className="donation-description">
                      {donation.description ||
                        "Shared with care by your community."}
                    </p>

                    <div className="quantity-line">
                      <span>Quantity remaining</span>
                      <strong>
                        {donation.remainingQuantity ?? donation.quantity ?? "—"}{" "}
                        {donation.quantityUnit || "pieces"}
                      </strong>
                    </div>

                    {donation.pickupLocation && (
                      <div className="donation-detail">
                        <span className="detail-label">PICKUP AREA</span>
                        <p>{donation.pickupLocation}</p>
                      </div>
                    )}

                    {donation.type === "FOOD" && donation.expiryDate && (
                      <div className="donation-detail">
                        <span className="detail-label">
                          BEST BEFORE / EXPIRY
                        </span>
                        <p>
                          {new Date(donation.expiryDate).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    )}

                    {donation.type === "FOOD" && donation.allergens && (
                      <p className="food-note">
                        <strong>Allergens:</strong> {donation.allergens}
                      </p>
                    )}

                    {donation.type === "FOOD" &&
                      donation.storageInstructions && (
                        <p className="food-note">
                          <strong>Storage:</strong>{" "}
                          {donation.storageInstructions}
                        </p>
                      )}

                    <div className="card-bottom">
                      <span>Shared with care</span>
                      <span className="card-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </div>
        )}
      </section>

      {/* Modal to Post a Need */}
      {showNeedModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--paper)",
              padding: "32px",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "var(--shadow)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 style={{ fontFamily: "Playfair Display, serif", margin: "0 0 16px 0" }}>
              Request a Resource Need
            </h2>
            <p style={{ color: "var(--muted)", margin: "0 0 20px 0", fontSize: "0.95rem" }}>
              Tell community donors what your organization urgently needs.
            </p>

            {needMessage && (
              <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "16px" }}>
                {needMessage}
              </div>
            )}

            <form onSubmit={handleCreateNeed} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "4px" }}>
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Winter Blankets or 30kg Rice"
                  value={needForm.title}
                  onChange={(e) => setNeedForm({ ...needForm, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "4px" }}>
                  Category *
                </label>
                <select
                  value={needForm.type}
                  onChange={(e) => setNeedForm({ ...needForm, type: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                >
                  <option value="FOOD">Food</option>
                  <option value="GOODS">Essentials / Goods</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "4px" }}>
                  Quantity Required *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={needForm.quantity}
                  onChange={(e) => setNeedForm({ ...needForm, quantity: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "4px" }}>
                  Delivery / Shelter Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar Shelter, Bangalore"
                  value={needForm.location}
                  onChange={(e) => setNeedForm({ ...needForm, location: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "4px" }}>
                  Description / Purpose
                </label>
                <textarea
                  rows="3"
                  placeholder="Why do you need this and who will it help?"
                  value={needForm.description}
                  onChange={(e) => setNeedForm({ ...needForm, description: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNeedModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={needSubmitting}
                >
                  {needSubmitting ? "Posting..." : "Post Need"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="feed-footer">
        <p className="footer-brand">sahaya.</p>
        <p>Good things deserve to go further.</p>
      </footer>
    </main>
  );
}
