import { useEffect, useMemo, useRef, useState } from "react";
const styles = {
    page: {
        minHeight: "100vh",
        padding: 16,
        background:
            "radial-gradient(1200px 700px at 20% 10%, rgba(120,180,255,.35), transparent 60%)," +
            "radial-gradient(900px 600px at 90% 30%, rgba(180,240,255,.22), transparent 55%)," +
            "linear-gradient(180deg, #071321 0%, #0a1b2f 45%, #0b2236 100%)",
        color: "white",
    } as React.CSSProperties,

    card: {
        maxWidth: 560,
        margin: "0 auto",
        borderRadius: 22,
        padding: 16,
        border: "1px solid rgba(255,255,255,.12)",
        background:
            "linear-gradient(180deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.06) 100%)",
        boxShadow: "0 18px 50px rgba(0,0,0,.45)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
    } as React.CSSProperties,

    glowLine: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
            "radial-gradient(700px 220px at 30% 0%, rgba(170,240,255,.25), transparent 60%)," +
            "radial-gradient(600px 240px at 80% 20%, rgba(120,200,255,.18), transparent 55%)",
    } as React.CSSProperties,

    title: {
        margin: "6px 0 14px",
        fontSize: 22,
        fontWeight: 900,
        letterSpacing: 0.3,
    } as React.CSSProperties,

    timer: {
        fontSize: 64,
        fontWeight: 950,
        letterSpacing: 1,
        lineHeight: 1,
        marginTop: 6,
        textShadow: "0 10px 30px rgba(0,0,0,.55)",
    } as React.CSSProperties,

    subtitle: {
        opacity: 0.82,
        marginTop: 10,
        fontSize: 14,
    } as React.CSSProperties,

    grid: {
        display: "grid",
        gap: 10,
        marginTop: 16,
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    } as React.CSSProperties,

    // BIG, icy, tappable buttons
    btn: {
        appearance: "none",
        border: "1px solid rgba(255,255,255,.18)",
        background:
            "linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.10) 100%)",
        color: "white",
        borderRadius: 16,
        padding: "14px 14px",
        fontWeight: 800,
        fontSize: 15,
        minHeight: 52, // finger-friendly
        textAlign: "left",
        boxShadow: "0 10px 24px rgba(0,0,0,.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
    } as React.CSSProperties,

    btnPrimary: {
        border: "1px solid rgba(120,220,255,.35)",
        background:
            "linear-gradient(180deg, rgba(110,220,255,.35) 0%, rgba(40,140,255,.22) 100%)",
        boxShadow: "0 14px 30px rgba(30,120,255,.25), 0 10px 24px rgba(0,0,0,.35)",
    } as React.CSSProperties,

    btnDanger: {
        border: "1px solid rgba(255,120,120,.28)",
        background:
            "linear-gradient(180deg, rgba(255,120,120,.20) 0%, rgba(255,255,255,.08) 100%)",
    } as React.CSSProperties,

    btnRowFull: {
        gridColumn: "1 / -1",
    } as React.CSSProperties,

    hint: {
        marginTop: 12,
        fontSize: 12.5,
        opacity: 0.75,
        lineHeight: 1.35,
    } as React.CSSProperties,
};

// Minimal “snow” overlay (ingen bild, bara CSS)
function Snow() {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.35,
                background:
                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,.9) 0 1px, transparent 2px)," +
                    "radial-gradient(circle at 70% 30%, rgba(255,255,255,.8) 0 1px, transparent 2px)," +
                    "radial-gradient(circle at 40% 70%, rgba(255,255,255,.7) 0 1px, transparent 2px)," +
                    "radial-gradient(circle at 85% 80%, rgba(255,255,255,.75) 0 1px, transparent 2px)",
                filter: "blur(.2px)",
                animation: "snowDrift 6s linear infinite",
            }}
        />
    );
}


const DURATION_MS = 15 * 60 * 1000;
const STORAGE_KEY = "vinter_timer_v1";

type TimerState = {
    running: boolean;
    endAt: number | null; // epoch ms, only used when running
    remainingMs: number;  // used when paused/stopped
};

function format(ms: number) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

async function ensureNotifyPermission() {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;

    try {
        const res = await Notification.requestPermission();
        return res === "granted";
    } catch {
        return false;
    }
}

async function notifyDone() {
    const ok = await ensureNotifyPermission();
    if (!ok) return;
    try {
        new Notification("Vinter: 15 min klart", { body: "Dags att göra grejen 👀" });
    } catch {
        // ignore
    }
}
function vibrateDone() {
    if (!("vibrate" in navigator)) return;

    try {
        // Vibrationsmönster: vibrera – paus – vibrera
        navigator.vibrate([300, 200, 300, 200, 500]);
    } catch {
        // ignore
    }
}


export default function Vinter() {
    // Used to force a re-render so countdown updates on screen
    const [now, setNow] = useState(() => Date.now());

    const [state, setState] = useState<TimerState>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw) as TimerState;
        } catch { }
        return { running: false, endAt: null, remainingMs: DURATION_MS };
    });

    // Put your own sound here (file in /public)
    const soundSrc = "/sounds/bromsmotion.mp3";
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist timer state
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch { }
    }, [state]);

    // Tick "now" every second while running so the UI counts down
    useEffect(() => {
        if (!state.running) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [state.running]);

    // Compute remaining time
    const remaining = useMemo(() => {
        if (!state.running || !state.endAt) return state.remainingMs;
        return state.endAt - now;
    }, [state.running, state.endAt, state.remainingMs, now]);

    // If app comes back from background, resync
    useEffect(() => {
        const onVis = () => setNow(Date.now());
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    // Handle completion (trigger once when it hits 0 while running)
    useEffect(() => {
        if (!state.running) return;
        if (remaining > 0) return;

        // Stop timer + reset back to 15:00
        setState({ running: false, endAt: null, remainingMs: DURATION_MS });

        // Best-effort notify + sound
        (async () => {
            await notifyDone();
            vibrateDone(); // 👈 NYTT

            try {
                if (!audioRef.current) audioRef.current = new Audio(soundSrc);

                audioRef.current.volume = 1;
                audioRef.current.muted = false;
                audioRef.current.currentTime = 0;

                const p = audioRef.current.play();
                if (p) await p;
            } catch (e) {
                console.warn("Kunde inte spela ljud vid klart:", e);
            }
        })();

    }, [remaining, state.running]);

    const start = () => {
        setNow(Date.now());
        setState((prev) => {
            const base = prev.remainingMs > 0 ? prev.remainingMs : DURATION_MS;
            return { running: true, endAt: Date.now() + base, remainingMs: base };
        });
    };

    const pause = () => {
        setNow(Date.now());
        setState((prev) => {
            if (!prev.running || !prev.endAt) return prev;
            const rem = Math.max(0, prev.endAt - Date.now());
            return { running: false, endAt: null, remainingMs: rem };
        });
    };

    const reset15 = () => {
        setNow(Date.now());
        setState({ running: false, endAt: null, remainingMs: DURATION_MS });
    };

    const stop = () => {
        // "Stäng av" = stoppa och tillbaka till 15:00
        setNow(Date.now());
        setState({ running: false, endAt: null, remainingMs: DURATION_MS });
    };

    const testSoundUnlock = async () => {
        try {
            if (!audioRef.current) audioRef.current = new Audio(soundSrc);

            audioRef.current.volume = 1;
            audioRef.current.muted = false;
            audioRef.current.currentTime = 0;

            const p = audioRef.current.play();
            if (p) await p;
        } catch (e) {
            console.error("Ljud kunde inte spelas:", e);
            alert("Ljud kunde inte spelas. Kolla Console (F12).");
        }
    };


    const testNotification = async () => {
        const ok = await ensureNotifyPermission();
        if (!ok) return;
        try {
            new Notification("Vinter: test", { body: "Notiser funkar ✅" });
        } catch { }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.glowLine} />
                <Snow />

                <h1 style={styles.title}>Vinter</h1>

                <div style={styles.timer}>{format(remaining)}</div>
                <div style={styles.subtitle}>
                    Påminnelse var 15:e minut: motionera bromsarna.
                </div>

                <div style={styles.grid}>
                    <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={start}>
                        Start
                    </button>

                    <button style={styles.btn} onClick={pause}>
                        Pausa
                    </button>

                    <button style={styles.btn} onClick={reset15}>
                        Reset 15:00
                    </button>

                    <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={stop}>
                        Stäng av
                    </button>

                    <button style={{ ...styles.btn, ...styles.btnRowFull }} onClick={testSoundUnlock}>
                        Testa ljud (låser upp)
                    </button>

                    <button style={{ ...styles.btn, ...styles.btnRowFull }} onClick={testNotification}>
                        Testa notis
                    </button>
                </div>

                <div style={styles.hint}>
                    Tips: Tryck “Testa ljud” en gång per session på mobil för att låsa upp uppspelning.
                </div>
            </div>
        </div>
    );

}
