import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [missionsByDonation, setMissionsByDonation] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");
  const [requestingMissionDonationId, setRequestingMissionDonationId] = useState(null);
  const [handoverInput, setHandoverInput] = useState({});
  const [completingMissionId, setCompletingMissionId] = useState(null);

  async function loadClaims() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/claims/my");
      const claimsData = Array.isArray(response.data) ? response.data : [];
      setClaims(claimsData);

      // Load associated missions in parallel
      const missionMap = {};
      await Promise.all(
        claimsData.map(async (c) => {
          try {
            const mRes = await api.get(`/missions/donation/${c.donationId}`);
            if (mRes.data) {
              missionMap[c.donationId] = mRes.data;
            }
          } catch {
            // No mission found or error, ignore
          }
        })
      );
      setMissionsByDonation(missionMap);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your claims. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClaims();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "Date unavailable"
      : parsedDate.toLocaleString();
  };

  const statusLabel = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  async function cancelClaim(claim) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel your claim for "${claim.donationTitle || "this donation"}"?`
    );

    if (!confirmed) return;

    try {
      setCancellingId(claim.id);
      setError("");
      setMessage("");

      await api.put(`/claims/${claim.id}/cancel`);

      setClaims((previousClaims) =>
        previousClaims.map((item) =>
          item.id === claim.id
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );

      setMessage(`Claim #${claim.id} cancelled successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel this claim. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  }

  async function requestVolunteerPickup(claim) {
    try {
      setRequestingMissionDonationId(claim.donationId);
      setError("");
      setMessage("");

      const res = await api.post("/missions", {
        donationId: claim.donationId,
        receiverId: claim.receiverId,
      });

      setMissionsByDonation((prev) => ({
        ...prev,
        [claim.donationId]: res.data,
      }));

      setMessage(
        `Volunteer pickup mission created for "${claim.donationTitle}"! Nearby volunteers can now accept it.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to request volunteer pickup. Ensure donation is in claimed status."
      );
    } finally {
      setRequestingMissionDonationId(null);
    }
  }

  async function completeMission(missionId, donationId) {
    const code = handoverInput[missionId]?.trim();
    if (!code) {
      setError("Please enter the handover code provided by the volunteer.");
      return;
    }

    try {
      setCompletingMissionId(missionId);
      setError("");
      setMessage("");

      await api.post(`/missions/${missionId}/complete`, {
        handoverCode: code,
      });

      setMessage("Delivery verified and completed successfully! 🎉");
      await loadClaims();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid handover code. Please check with the volunteer."
      );
    } finally {
      setCompletingMissionId(null);
    }
  }

  return (
    <main className="my-claims-page">
      <header className="my-claims-header">
        <p className="eyebrow">SAHAYA / RECEIVER</p>
        <h1>My Claims</h1>
        <p>Keep track of the donations your organisation has claimed.</p>
      </header>

      {loading && <p>Loading your claims...</p>}

      {!loading && error && (
        <section role="alert" className="claims-message" style={{ background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" }}>
          <p>{error}</p>
          <button type="button" onClick={loadClaims}>
            Try again
          </button>
        </section>
      )}

      {!loading && message && (
        <p role="status" className="claims-message" style={{ background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }}>
          {message}
        </p>
      )}

      {!loading && !error && claims.length === 0 && (
        <section className="claims-empty">
          <h2>No claims yet</h2>
          <p>Donations you claim will appear here.</p>
          <Link to="/feed">Explore donations</Link>
        </section>
      )}

      {!loading && !error && claims.length > 0 && (
        <section className="claims-list">
          <p className="claims-count">
            {claims.length} {claims.length === 1 ? "claim" : "claims"}
          </p>

          {claims.map((claim) => {
            const mission = missionsByDonation[claim.donationId];

            return (
              <article className="claim-card" key={claim.id}>
                <div className="claim-card-top">
                  <div>
                    <p className="claim-label">Claim #{claim.id}</p>
                    <h2>{claim.donationTitle || "Donation"}</h2>
                  </div>

                  <span
                    className={`claim-status ${String(
                      claim.status || "unknown"
                    ).toLowerCase()}`}
                  >
                    {statusLabel(claim.status)}
                  </span>
                </div>

                <div className="claim-details">
                  <div>
                    <span>Quantity claimed</span>
                    <strong>{claim.quantity ?? "—"}</strong>
                  </div>

                  <div>
                    <span>Claimed on</span>
                    <strong>{formatDate(claim.claimedAt)}</strong>
                  </div>
                </div>

                {/* Logistics & Volunteer Status Box */}
                {claim.status === "ACTIVE" && (
                  <div
                    style={{
                      background: "var(--cream)",
                      border: "1px dashed var(--border)",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      margin: "14px 0",
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: "0 0 6px 0", color: "var(--burgundy)" }}>
                      Transit & Delivery
                    </p>

                    {!mission ? (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
                          Need help transporting this donation to your shelter?
                        </span>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                          disabled={requestingMissionDonationId === claim.donationId}
                          onClick={() => requestVolunteerPickup(claim)}
                        >
                          {requestingMissionDonationId === claim.donationId
                            ? "Requesting..."
                            : "Request Volunteer Pickup"}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.88rem" }}>
                            Volunteer Mission: <strong style={{ color: "var(--burgundy)" }}>{mission.status}</strong>
                          </span>
                          {mission.volunteerName && (
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                              Volunteer: <strong>{mission.volunteerName}</strong>
                            </span>
                          )}
                        </div>

                        {mission.status === "AVAILABLE" && (
                          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
                            Mission is broadcasted. Waiting for a community volunteer to accept.
                          </p>
                        )}

                        {mission.status === "ACCEPTED" && (
                          <p style={{ margin: 0, fontSize: "0.85rem", color: "#0369a1" }}>
                            Volunteer accepted! They are heading to the donor location.
                          </p>
                        )}

                        {mission.status === "PICKED_UP" && (
                          <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                            <input
                              type="text"
                              placeholder="Enter Handover Code"
                              value={handoverInput[mission.id] || ""}
                              onChange={(e) =>
                                setHandoverInput({
                                  ...handoverInput,
                                  [mission.id]: e.target.value,
                                })
                              }
                              style={{
                                padding: "8px 12px",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                width: "180px",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                              disabled={completingMissionId === mission.id}
                              onClick={() => completeMission(mission.id, claim.donationId)}
                            >
                              {completingMissionId === mission.id
                                ? "Verifying..."
                                : "Verify & Complete Delivery"}
                            </button>
                          </div>
                        )}

                        {mission.status === "COMPLETED" && (
                          <p style={{ margin: 0, fontSize: "0.88rem", color: "#166534", fontWeight: 600 }}>
                            ✓ Verified and delivered by {mission.volunteerName || "volunteer"}!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="claim-actions">
                  <Link
                    className="claim-view-link"
                    to={`/donations/${claim.donationId}`}
                  >
                    View donation
                  </Link>

                  {claim.status === "ACTIVE" && !mission && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={cancellingId === claim.id}
                      onClick={() => cancelClaim(claim)}
                    >
                      {cancellingId === claim.id
                        ? "Cancelling..."
                        : "Cancel claim"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}