import { useMemo, useRef, useState } from "react";
import AtcSthBox from "../pages/AtcSthBox";

type Item = {
    id: string;
    label: string;
    imgSrc: string; // t.ex. "/atc/sida1.jpg"
};

type TextSection = {
    title: string;
    bullets: React.ReactNode[]; // ✅ här är grejen
};

// ✅ Fyll på här i VS Code (ingen kan redigera i appen)
const ATC_TEXT: TextSection[] = [
    {
        title: "Hagalund",
        bullets: [
            <>
                Tågfärd får <strong>utan att stanna</strong> övergå i växling vid <strong>dvsi</strong> <strong>100</strong>, <strong>102</strong>,{" "}
                <strong>104</strong>, <strong>106</strong>, <strong>108</strong>,{" "}
                <strong>110</strong>, <strong>122</strong>, <strong>124</strong> eller{" "}
                <strong>126</strong> till Hagalund.
            </>,
            <>
                Tågfärd får <strong>efter att ha stannat</strong> vid <strong>So 1104 eller 1106</strong> övergå i
                växling till <strong>spår 20</strong> eller <strong>spår B1</strong> i Hagalund.
            </>,
            <>
                Tågfärd får <strong>efter att ha stannat </strong> vid <strong>So 1146 eller 1148</strong> övergå i
                växling till Hagalund.
            </>,
            <>
                Tågfärd får <strong>utan att stanna</strong> övergå i växling vid <strong>So 1276</strong>{" "}
                till <strong>spår D1 och D2</strong>.
            </>,
            <>
                Tågfärd får <strong>efter att ha stannat</strong> övergå i växling vid msi <strong>So 1278</strong>{" "}
                till <strong>spår D1</strong>.
            </>,
        ],
    },
    {
        title: "Jimo",
        bullets: [
            <>
                Tågväg: <strong>1800</strong>, Bomfällning: <strong>1801</strong>
            </>,
            <>
                1an (<strong>1200</strong>) Aktuell tkl, 2an (<strong>1300</strong>) Närmsta fjärr,{" "}
                Elsymbolen (<strong>1400</strong>) aktuell eldrift, <strong>1011</strong> Drifttekniker järnväg
            </>,
            <>
                <strong>1201</strong> Fjtkl Malmö C, <strong>1208</strong> Fjtkl Svågertorp - Peberholm,{" "}
                <strong>1200</strong> Ltkl Nässjö
            </>,
        ],
    },
];

export default function AtcCheatSheet() {
    const items = useMemo<Item[]>(
        () => [
            { id: "a1", label: "Tillsättningstid", imgSrc: "/atc/sida1.jpg" },
            { id: "a2", label: "Bromsprocent - Retard sida 1", imgSrc: "/atc/sida2.jpg" },
            { id: "a3", label: "Bromsprocent - Retard sida 2", imgSrc: "/atc/sida3.jpg" },
            { id: "a4", label: "Bromsprocenttabell C", imgSrc: "/atc/sida4.jpg" },
            { id: "a5", label: "Bromsprocenttabell B", imgSrc: "/atc/sida5.jpg" },
            { id: "a6", label: "Bromsprocenttabell A", imgSrc: "/atc/sida6.jpg" },
            { id: "a7", label: "Bromsprocenttabell U", imgSrc: "/atc/sida7.jpg" },
            { id: "a8", label: "Bromsprocenttabell T", imgSrc: "/atc/sida8.jpg" },
            { id: "a9", label: "Karta Bromsprocenttabell", imgSrc: "/atc/sida9.jpg" },
            { id: "a10", label: "Spårkarta Hagalund", imgSrc: "/atc/sida10.jpg" },
            { id: "a11", label: "Spårkarta Malmö", imgSrc: "/atc/sida11.jpg" },
        ],
        []
    );

    const [activeId, setActiveId] = useState(items[0].id);
    const [zoomOpen, setZoomOpen] = useState(false);
    const lastCloseMsRef = useRef(0);

    const active = items.find((x) => x.id === activeId)!;

    const closeZoomSafely = (e?: React.SyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        lastCloseMsRef.current = Date.now();
        setZoomOpen(false);
    };

    return (
        <div style={{ display: "grid", gap: 12 }}>
            {/* ✅ STH-rutan högst upp */}
            <AtcSthBox />

            {/* Knappar */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 8,
                    pointerEvents: zoomOpen ? "none" : "auto",
                }}
            >
                {items.map((it) => (
                    <button
                        key={it.id}
                        onClick={() => {
                            if (Date.now() - lastCloseMsRef.current < 350) return;
                            setActiveId(it.id);
                            setZoomOpen(true);
                        }}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "var(--text)",
                            background: it.id === activeId ? "var(--card)" : "var(--card)",
                            cursor: "pointer",
                            textAlign: "left",
                        }}
                    >
                        {it.label}
                    </button>
                ))}
            </div>

            {/* ✅ Textsektion längst ner */}
            <div
                style={{
                    marginTop: 4,
                    padding: 14,
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    display: "grid",
                    gap: 12,
                }}
            >
                <div style={{ fontWeight: 900 }}>Lite övrigt bra att ha</div>

                {ATC_TEXT.map((section, i) => (
                    <div key={i} style={{ display: "grid", gap: 6 }}>
                        <div style={{ fontWeight: 700, opacity: 0.9 }}>{section.title}</div>

                        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
                            {section.bullets.map((t, j) => (
                                <li key={j} style={{ fontSize: 14 }}>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Zoom-modal */}
            {zoomOpen && (
                <div
                    onPointerDown={(e) => closeZoomSafely(e)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.85)",
                        zIndex: 9999,
                        padding: 12,
                    }}
                >
                    <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative",
                            height: "100%",
                            width: "100%",
                            background: "transparent",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
                        {/* Header */}
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                right: 10,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                                zIndex: 2,
                            }}
                        >
                            <div
                                style={{
                                    color: "var(--card)",
                                    fontWeight: 600,
                                    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                                }}
                            >
                                {active.label}
                            </div>
                            <button
                                onPointerDown={(e) => closeZoomSafely(e)}
                                style={{
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid #444",
                                    cursor: "pointer",
                                    background: "rgba(0,0,0,0.35)",
                                    color: "var(--bg)",
                                }}
                            >
                                Stäng
                            </button>
                        </div>

                        <div
                            onPointerUpCapture={(e) => closeZoomSafely(e)}
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "grid",
                                placeItems: "center",
                                overflow: "hidden",
                                paddingTop: "max(56px, env(safe-area-inset-top))",
                                paddingBottom: "max(16px, env(safe-area-inset-bottom))",
                                paddingLeft: 0,
                                paddingRight: 0,
                            }}
                        >
                            <img
                                src={active.imgSrc}
                                alt={active.label}
                                draggable={false}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "calc(100% - 72px)",
                                    width: "auto",
                                    height: "auto",
                                    objectFit: "contain",
                                    display: "block",
                                    userSelect: "none",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
