import { useState, useEffect } from "react";

export default function CountdownBadge({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    if (diff <= 0) return { expired: true, text: "Expired" };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const isUrgent = diff < 60 * 60 * 1000; // under 1 hour

    let text = "";
    if (hours > 0) {
      text = `${hours}h ${minutes}m left`;
    } else {
      text = `${minutes}m ${seconds}s left`;
    }

    return { expired: false, isUrgent, text };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "#fee2e2",
          color: "#991b1b",
          padding: "3px 8px",
          borderRadius: "999px",
          fontSize: "0.78rem",
          fontWeight: 600,
        }}
      >
        ⚠️ Expired
      </span>
    );
  }

  if (timeLeft.isUrgent) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "#fef3c7",
          color: "#b45309",
          border: "1px solid #fde68a",
          padding: "3px 8px",
          borderRadius: "999px",
          fontSize: "0.78rem",
          fontWeight: 700,
          animation: "pulse 1.5s infinite",
        }}
      >
        ⏳ Urgent: {timeLeft.text}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "#dcfce7",
        color: "#166534",
        padding: "3px 8px",
        borderRadius: "999px",
        fontSize: "0.78rem",
        fontWeight: 600,
      }}
    >
      🌿 Fresh: {timeLeft.text}
    </span>
  );
}
