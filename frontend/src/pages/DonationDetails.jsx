import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function DonationDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimQuantity, setClaimQuantity] = useState("1");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimError, setClaimError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchDonation() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/donations/${id}`);

        if (active) {
          setDonation(response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.status === 404
              ? "This donation is no longer available."
              : "Could not load this donation. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchDonation();

    return () => {
      active = false;
    };
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "Not provided";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const isVerifiedReceiver =
    user?.role === "RECEIVER_ORG" && user?.verified === true;

  const availableQuantity = Number(
  donation?.remainingQuantity ?? donation?.quantity ?? 0
);

  const validQuantity =
    claimQuantity.trim() !== "" &&
    Number.isInteger(Number(claimQuantity)) &&
    Number(claimQuantity) >= 1 &&
    Number(claimQuantity) <= availableQuantity;

  const unavailableStatuses = ["CLAIMED", "EXPIRED", "CANCELLED"];

  const canClaim =
    isVerifiedReceiver &&
    !unavailableStatuses.includes(donation?.status) &&
    availableQuantity > 0;

  async function handleClaim(event) {
  event.preventDefault();

  setClaimMessage("");
  setClaimError("");

  if (!validQuantity) {
    setClaimError(
      `Enter a whole number between 1 and ${availableQuantity}.`
    );
    return;
  }

  setClaimLoading(true);

  try {
    const response = await api.post(`/claims/donation/${id}`, {
      quantity: Number(claimQuantity),
    });

    // The claim was created successfully.
    setClaimMessage(
      response.data?.message || "Donation claimed successfully."
    );

    setClaimQuantity("1");

    // Refresh separately so a refresh error doesn't undo the success message.
    // Refresh donation details after a successful claim.
try {
  const updatedDonation = await api.get(`/donations/${id}`);
  setDonation(updatedDonation.data);

  setClaimQuantity(
    String(
      Math.max(
        1,
        Number(updatedDonation.data.remainingQuantity ?? 0)
      )
    )
  );
} catch (refreshError) {
  if (refreshError.response?.status === 404) {
    setDonation((current) =>
      current
        ? {
            ...current,
            status: "CLAIMED",
            remainingQuantity: 0,
          }
        : current
    );
    setClaimQuantity("1");
  } else {
    console.error(
      "Claim succeeded, but donation refresh failed:",
      refreshError
    );
  }
}
  } catch (err) {
    setClaimError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Could not claim this donation. Please try again."
    );
  } finally {
    setClaimLoading(false);
  }
}

  if (loading) {
    return (
      <main className="page-container details-page">
        <p className="subtitle">Loading donation details...</p>
      </main>
    );
  }

  if (error || !donation) {
    return (
      <main className="page-container details-page">
        <section className="details-card">
          <p className="eyebrow">DONATION DETAILS</p>
          <h1>Unable to load donation</h1>
          <p className="subtitle">
            {error || "This donation could not be found."}
          </p>
          <Link to="/feed" className="btn btn-primary">
            Back to donations
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container details-page">
      <Link to="/feed" className="details-back">
        ← Back to donations
      </Link>

      <section className="details-card">
        <div className="donation-card-top">
          <span
            className={`type-pill ${
              donation.type === "FOOD" ? "food-pill" : "goods-pill"
            }`}
          >
            {donation.type === "FOOD" ? "FOOD" : "ESSENTIALS"}
          </span>

          <span className="status-pill">
            {(donation.status || "AVAILABLE").replaceAll("_", " ")}
          </span>
        </div>

        <p className="eyebrow">COMMUNITY DONATION</p>
        <h1>{donation.title}</h1>

        <p className="details-description">
          {donation.description || "Shared with care by your community."}
        </p>

        <div className="details-quantity">
  <span>Quantity remaining</span>
  <strong>
    {availableQuantity} {donation.quantityUnit || "pieces"}
  </strong>
</div>

        <div className="details-information">
          <div className="details-information-item">
            <span className="detail-label">PICKUP AREA</span>
            <p>{donation.pickupLocation || "Not provided"}</p>
          </div>

          <div className="details-information-item">
            <span className="detail-label">EXPIRY DATE</span>
            <p>{formatDate(donation.expiryDate)}</p>
          </div>

          {donation.type === "FOOD" && (
            <>
              <div className="details-information-item">
                <span className="detail-label">FOOD PREPARED AT</span>
                <p>{formatDate(donation.foodPreparedAt)}</p>
              </div>

              <div className="details-information-item">
                <span className="detail-label">ALLERGENS</span>
                <p>{donation.allergens || "Not specified"}</p>
              </div>

              <div className="details-information-item">
                <span className="detail-label">STORAGE INSTRUCTIONS</span>
                <p>
                  {donation.storageInstructions || "Not specified"}
                </p>
              </div>
            </>
          )}

          {donation.donorName && (
            <div className="details-information-item">
              <span className="detail-label">SHARED BY</span>
              <p>{donation.donorName}</p>
            </div>
          )}
        </div>

        {isVerifiedReceiver && (
          <section className="claim-section">
            <h2>Claim this donation</h2>
            <p className="subtitle">
              Enter the quantity your organization needs.
            </p>

            {claimMessage && (
              <p role="status" className="claim-success">
                {claimMessage}
              </p>
            )}

            {claimError && (
              <p role="alert" className="claim-error">
                {claimError}
              </p>
            )}

            {canClaim ? (
              <form onSubmit={handleClaim}>
                <label htmlFor="claimQuantity">Quantity to claim</label>

                <input
                  id="claimQuantity"
                  type="number"
                  min="1"
                  max={availableQuantity}
                  step="1"
                  value={claimQuantity}
                  onChange={(event) =>
                    setClaimQuantity(event.target.value)
                  }
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={claimLoading || !validQuantity}
                >
                  {claimLoading ? "Submitting..." : "Claim Donation"}
                </button>
              </form>
            ) : (
              <p className="subtitle">
                This donation is not currently available to claim.
              </p>
            )}
          </section>
        )}

        {!user && (
          <p className="subtitle">
            <Link to="/login">Log in</Link> as a verified receiver
            organization to claim donations.
          </p>
        )}

        {user?.role === "RECEIVER_ORG" && !user?.verified && (
          <p className="subtitle">
            Your organization must be verified by an admin before claiming
            donations.
          </p>
        )}

        <div className="details-actions">
          <Link to="/feed" className="btn btn-secondary">
            Browse donations
          </Link>
        </div>
      </section>
    </main>
  );
}