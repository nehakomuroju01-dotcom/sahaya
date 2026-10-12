import { useState, useRef, useEffect } from "react";
import api from "../services/api";

const QUICK_PROMPTS = [
  "How do I donate food?",
  "How can I volunteer for deliveries?",
  "What are the food safety rules?",
  "How do shelters verify their organization?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! I'm your Sahaya Assistant. How can I help you today? Ask me about donations, claims, volunteering, or food safety guidelines!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: text });
      const botReply = res.data?.reply || "I'm here to help! Ask me anything about Sahaya.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--burgundy)",
            color: "white",
            border: "none",
            borderRadius: "999px",
            padding: "12px 20px",
            boxShadow: "0 8px 24px rgba(118, 43, 59, 0.35)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label="Open AI Assistant"
        >
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          <span>Ask Sahaya AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: "360px",
            maxWidth: "calc(100vw - 32px)",
            height: "520px",
            maxHeight: "calc(100vh - 100px)",
            background: "var(--paper)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            boxShadow: "0 16px 40px rgba(52, 37, 31, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "var(--burgundy)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#4ade80",
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", color: "white", fontFamily: "Playfair Display, serif" }}>
                  Sahaya Assistant
                </h3>
                <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>AI Help & Food Safety</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "1.3rem",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
              }}
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "var(--cream)",
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.sender === "user" ? "var(--burgundy)" : "white",
                  color: m.sender === "user" ? "white" : "#34251f",
                  padding: "10px 14px",
                  borderRadius:
                    m.sender === "user"
                      ? "14px 14px 2px 14px"
                      : "14px 14px 14px 2px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  fontSize: "0.9rem",
                  lineHeight: 1.45,
                  border: m.sender === "bot" ? "1px solid var(--border)" : "none",
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "white",
                  padding: "10px 16px",
                  borderRadius: "14px 14px 14px 2px",
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: "8px 12px",
              background: "var(--paper)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: "1px solid var(--border)",
                  background: "white",
                  color: "var(--burgundy)",
                  cursor: "pointer",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "12px 16px",
              background: "var(--paper)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                fontSize: "0.9rem",
                outline: "none",
                background: "white",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "var(--burgundy)",
                color: "white",
                border: "none",
                borderRadius: "999px",
                padding: "10px 16px",
                fontWeight: 600,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
                fontSize: "0.85rem",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
