export default function ImpactCertificateModal({ donation, onClose }) {
  if (!donation) return null;

  function handlePrint() {
    window.print();
  }

  const formattedDate = donation.createdAt
    ? new Date(donation.createdAt).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fffdfa",
          maxWidth: "700px",
          width: "100%",
          borderRadius: "16px",
          padding: "36px",
          position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          border: "4px double var(--burgundy)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            fontSize: "1.4rem",
            cursor: "pointer",
            color: "var(--muted)",
          }}
        >
          ✕
        </button>

        {/* Certificate Body */}
        <div id="printable-certificate" style={{ textAlign: "center", padding: "10px" }}>
          <p
            style={{
              letterSpacing: "4px",
              color: "var(--burgundy)",
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              margin: "0 0 10px 0",
            }}
          >
            SAHAYA COMMUNITY IMPACT NETWORK
          </p>

          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "2.3rem",
              color: "#34251f",
              margin: "0 0 16px 0",
            }}
          >
            Certificate of Social Impact
          </h1>

          <p style={{ color: "#77655d", fontSize: "0.95rem", margin: "0 0 24px 0" }}>
            This certificate is proudly awarded in recognition of generous surplus resource contribution.
          </p>

          <div
            style={{
              background: "#faf6f0",
              border: "1px solid #ebd9c8",
              borderRadius: "12px",
              padding: "20px 24px",
              margin: "24px 0",
              textAlign: "left",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", fontSize: "0.95rem" }}>
              <div>
                <span style={{ color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", display: "block" }}>
                  Item Contributed
                </span>
                <strong style={{ color: "#34251f", fontSize: "1.1rem" }}>{donation.title}</strong>
              </div>

              <div>
                <span style={{ color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", display: "block" }}>
                  Category
                </span>
                <strong style={{ color: "#34251f" }}>
                  {donation.type === "FOOD" ? "Surplus Food / Meals" : "Essentials & Supplies"}
                </strong>
              </div>

              <div>
                <span style={{ color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", display: "block" }}>
                  Quantity Rescued
                </span>
                <strong style={{ color: "#34251f" }}>
                  {donation.quantity} {donation.quantityUnit || "units"}
                </strong>
              </div>

              <div>
                <span style={{ color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", display: "block" }}>
                  Date of Action
                </span>
                <strong style={{ color: "#34251f" }}>{formattedDate}</strong>
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "#66544d", fontStyle: "italic", margin: "0 0 28px 0" }}>
            "By diverting surplus resources to people and shelters in need, you prevented avoidable landfill waste and nourished lives."
          </p>

          {/* Verification Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e8dbce", paddingTop: "20px" }}>
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Verification Status
              </span>
              <p style={{ margin: "2px 0 0 0", color: "#166534", fontWeight: 700, fontSize: "0.9rem" }}>
                ✓ Cryptographically Verified Handover
              </p>
            </div>

            <div>
              <p style={{ margin: 0, fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--burgundy)" }}>
                sahaya.
              </p>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Community Logistics</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
