import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Custom SVG icon generator for zero-broken-asset rendering
function createCustomIcon(color) {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background: ${color};
        width: 26px;
        height: 26px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
}

const foodIcon = createCustomIcon("#dc2626"); // Red for food
const goodsIcon = createCustomIcon("#2563eb"); // Blue for goods
const needIcon = createCustomIcon("#16a34a"); // Green for needs

export default function DonationMap({ donations = [], needs = [] }) {
  const navigate = useNavigate();

  // Find center: first item with coords or default to Bangalore (12.9716, 77.5946)
  const firstWithCoords =
    donations.find((d) => d.latitude && d.longitude) ||
    needs.find((n) => n.latitude && n.longitude);

  const defaultCenter = firstWithCoords
    ? [firstWithCoords.latitude, firstWithCoords.longitude]
    : [12.9716, 77.5946];

  // If items don't have explicit coords, give them realistic spread around Bangalore center for demonstration
  const validDonations = donations.map((d, index) => {
    const lat = d.latitude || 12.9716 + (Math.sin(index + 1) * 0.04);
    const lng = d.longitude || 77.5946 + (Math.cos(index + 1) * 0.04);
    return { ...d, lat, lng };
  });

  const validNeeds = needs.map((n, index) => {
    const lat = n.latitude || 12.9716 + (Math.cos(index + 3) * 0.035);
    const lng = n.longitude || 77.5946 + (Math.sin(index + 3) * 0.035);
    return { ...n, lat, lng };
  });

  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          background: "var(--paper)",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "center", fontSize: "0.85rem", fontWeight: 600 }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dc2626" }} /> Food
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2563eb" }} /> Essentials
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a" }} /> Shelter Needs
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          Showing {validDonations.length + validNeeds.length} pins on city map
        </span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "420px", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Donation Markers */}
        {validDonations.map((d) => (
          <Marker
            key={`donation-${d.id}`}
            position={[d.lat, d.lng]}
            icon={d.type === "FOOD" ? foodIcon : goodsIcon}
          >
            <Popup>
              <div style={{ padding: "4px", minWidth: "180px" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: d.type === "FOOD" ? "#fee2e2" : "#dbeafe",
                    color: d.type === "FOOD" ? "#991b1b" : "#1e40af",
                    marginBottom: "6px",
                  }}
                >
                  {d.type === "FOOD" ? "SURPLUS FOOD" : "ESSENTIALS"}
                </span>
                <h4 style={{ margin: "2px 0 6px 0", fontSize: "1rem" }}>{d.title}</h4>
                <p style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: "#666" }}>
                  Quantity: <strong>{d.remainingQuantity ?? d.quantity} {d.quantityUnit || "units"}</strong>
                </p>
                {d.pickupLocation && (
                  <p style={{ margin: "0 0 10px 0", fontSize: "0.8rem", color: "#888" }}>
                    📍 {d.pickupLocation}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/donations/${d.id}`)}
                  style={{
                    width: "100%",
                    background: "var(--burgundy)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Need Markers */}
        {validNeeds.map((n) => (
          <Marker
            key={`need-${n.id}`}
            position={[n.lat, n.lng]}
            icon={needIcon}
          >
            <Popup>
              <div style={{ padding: "4px", minWidth: "180px" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "#dcfce7",
                    color: "#166534",
                    marginBottom: "6px",
                  }}
                >
                  SHELTER NEED
                </span>
                <h4 style={{ margin: "2px 0 6px 0", fontSize: "1rem" }}>{n.title}</h4>
                <p style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: "#666" }}>
                  Needed: <strong>{n.quantity} units</strong>
                </p>
                <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "#444" }}>
                  By: <strong>{n.organizationName || "Shelter"}</strong>
                </p>
                {n.location && (
                  <p style={{ margin: "0 0 6px 0", fontSize: "0.8rem", color: "#888" }}>
                    📍 {n.location}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
