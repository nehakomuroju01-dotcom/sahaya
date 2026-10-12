import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminReceivers() {
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);

  async function loadReceivers() {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/admin/pending-receivers");
    setReceivers(response.data);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Could not load pending receivers."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadReceivers();
  }, []);

  async function verifyReceiver(id) {
    try {
      setVerifyingId(id);
      setError("");

      await api.put(`/admin/verify-receiver/${id}`);
      await loadReceivers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not verify this receiver."
      );
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <main className="my-claims-page">
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Verify receivers</h1>
        <p>Review receiver organisations before they claim donations.</p>
      </div>

      {loading && <p>Loading receivers...</p>}

      {error && (
        <p role="alert" style={{ color: "#a32638" }}>
          {error}
        </p>
      )}

      {!loading && !error && receivers.length === 0 && (
        <p>No pending receivers to verify.</p>
      )}

      <div className="claims-list">
        {receivers.map((receiver) => (
          <article className="claim-card" key={receiver.id}>
            <h2>
              {receiver.name ||
                receiver.fullName ||
                `Receiver #${receiver.id}`}
            </h2>

            <p>{receiver.email}</p>

            <button
              type="button"
              className="btn btn-primary"
              disabled={verifyingId === receiver.id}
              onClick={() => verifyReceiver(receiver.id)}
            >
              {verifyingId === receiver.id
                ? "Verifying..."
                : "Verify organisation"}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}