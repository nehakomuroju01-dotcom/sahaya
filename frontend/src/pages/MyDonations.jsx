import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ImpactCertificateModal from "../components/ImpactCertificateModal";

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCertificateDonation, setSelectedCertificateDonation] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDonations() {
      try {
        const response = await api.get("/donations/my");

        if (active) {
          setDonations(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load your donations. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDonations();

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "Not specified"
      : parsed.toLocaleString();
  };

  return (
    <main className="my-claims-page">
      <header className="my-claims-header">
        <p className="eyebrow">SAHAYA / DONOR</p>
        <h1>My Donations</h1>
        <p>Keep track of the resources you've shared.</p>
        <Link to="/create" className="claim-view-link">
          + Create a donation
        </Link>
      </header>

      {loading && <p>Loading your donations...</p>}

      {!loading && error && (
        <section role="alert" className="claims-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </section>
      )}

      {!loading && !error && donations.length === 0 && (
        <section className="claims-empty">
          <h2>No donations yet</h2>
          <p>Your donations will appear here once you create them.</p>
          <Link to="/create">Create your first donation</Link>
        </section>
      )}

      {!loading && !error && donations.length > 0 && (
        <section className="claims-list">
          <p className="claims-count">
            {donations.length}{" "}
            {donations.length === 1 ? "donation" : "donations"}
          </p>

          {donations.map((donation) => (
            <article className="claim-card" key={donation.id}>
              <div className="claim-card-top">
                <div>
                  <p className="claim-label">
                    {donation.type || "DONATION"}
                  </p>
                  <h2>{donation.title}</h2>
                  <p>{donation.description}</p>
                </div>

                <span
                  className={`claim-status ${String(
                    donation.status || "unknown"
                  ).toLowerCase()}`}
                >
                  {String(donation.status || "Unknown").replaceAll(
                    "_",
                    " "
                  )}
                </span>
              </div>

              <div className="claim-details">
                <div>
                  <span>Quantity remaining</span>
                  <strong>
                    {donation.remainingQuantity ??
                      donation.quantity ??
                      "—"}{" "}
                    {donation.quantityUnit || "pieces"}
                  </strong>
                </div>

                <div>
                  <span>Expiry</span>
                  <strong>{formatDate(donation.expiryDate)}</strong>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", flexWrap: "wrap", gap: "10px" }}>
                <Link
                  className="claim-view-link"
                  to={`/donations/${donation.id}`}
                >
                  View donation
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                  onClick={() => setSelectedCertificateDonation(donation)}
                >
                  📜 Impact Certificate
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedCertificateDonation && (
        <ImpactCertificateModal
          donation={selectedCertificateDonation}
          onClose={() => setSelectedCertificateDonation(null)}
        />
      )}
    </main>
  );
}