import { useMemo, useState } from "react";

export default function Forbattring() {
    const [text, setText] = useState("");
    const [contact, setContact] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const remaining = useMemo(() => 2000 - text.length, [text]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            setStatus("sending");

            const payload = {
                message: text.trim(),
                contact: contact.trim() ? contact.trim() : undefined,
                userAgent: window.navigator.userAgent,
                url: window.location.href,
                ts: new Date().toISOString(),
            };

            const res = await fetch("/.netlify/functions/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Bad response");

            setStatus("sent");
            setText("");
            setContact("");
            setTimeout(() => setStatus("idle"), 2000);
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div
            style={{
                padding: 16,
                maxWidth: 720,
                margin: "0 auto",
                boxSizing: "border-box",
                overflowX: "hidden", // safety belt
            }}
        >
            <h2 style={{ margin: "6px 0 12px", fontSize: 22 }}>Förbättringsförslag</h2>

            <div style={{ marginBottom: 10, opacity: 0.75 }}>
                Skriv vad du vill. Buggar, idéer, “lägg till Vectron-knapp”, allt.
            </div>

            <form onSubmit={onSubmit} style={{ maxWidth: "100%" }}>
                <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>Meddelande</label>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    maxLength={2000}
                    placeholder="Skriv här…"
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                        padding: 12,
                        borderRadius: 14,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        resize: "vertical",
                        fontSize: 15,
                        lineHeight: 1.4,
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",      // ✅ låt den bryta rad
                        gap: 8,               // ✅ snyggt på wrap
                        justifyContent: "space-between",
                        marginTop: 8,
                        maxWidth: "100%",
                    }}
                >
                    <div style={{ fontSize: 12, opacity: 0.7, minWidth: 0 }}>
                        {remaining} tecken kvar
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7, minWidth: 0 }}>
                        Kontakt är valfritt
                    </div>
                </div>

                <label style={{ display: "block", fontWeight: 800, margin: "14px 0 6px" }}>
                    Kontakt (valfritt)
                </label>

                <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="t.ex. mail eller telefon"
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                        padding: 12,
                        borderRadius: 14,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 15,
                    }}
                />

                <button
                    type="submit"
                    disabled={status === "sending" || !text.trim()}
                    style={{
                        marginTop: 14,
                        width: "100%",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: status === "sending" ? "rgba(255,35,55,0.65)" : "#ff2337",
                        color: "white",
                        fontWeight: 900,
                        cursor: status === "sending" ? "not-allowed" : "pointer",
                    }}
                >
                    {status === "sending" ? "Skickar…" : "Skicka"}
                </button>

                {status === "sent" && <div style={{ marginTop: 10, fontWeight: 800 }}>✅ Skickat!</div>}
                {status === "error" && <div style={{ marginTop: 10, fontWeight: 800 }}>❌ Kunde inte skicka.</div>}
            </form>
        </div>
    );
}
