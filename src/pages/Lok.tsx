import { useMemo, useState } from "react";

// PDF-imports (Vite ger dig en riktig URL)
// OBS: kräver att filerna ligger i src/assets/lokpdf/
import p01 from "../assets/lokpdf/01.pdf?url";
import p02 from "../assets/lokpdf/02.pdf?url";
import p03 from "../assets/lokpdf/03.pdf?url";
import p04 from "../assets/lokpdf/04.pdf?url";
import p05 from "../assets/lokpdf/05.pdf?url";
import p06 from "../assets/lokpdf/06.pdf?url";
import p07 from "../assets/lokpdf/07.pdf?url";
import p08 from "../assets/lokpdf/08.pdf?url";
import p09 from "../assets/lokpdf/09.pdf?url";
import p10 from "../assets/lokpdf/10.pdf?url";
import p11 from "../assets/lokpdf/11.pdf?url";
import p12 from "../assets/lokpdf/12.pdf?url";
import p13 from "../assets/lokpdf/13.pdf?url";
import p14 from "../assets/lokpdf/14.pdf?url";

type DocItem = {
    id: string;
    label: string;
    src: string; // url
    kind: "pdf" | "image";
};

export default function Lok() {
    const pdfItems = useMemo<DocItem[]>(
        () => [
            { id: "p1", label: "1 Inledning", src: p01, kind: "pdf" },
            { id: "p2", label: "2 Beskrivning", src: p02, kind: "pdf" },
            { id: "p3", label: "3 Manöverering", src: p03, kind: "pdf" },
            { id: "p4", label: "4 Signalljus", src: p04, kind: "pdf" },
            { id: "p5", label: "5 Multipelkörning", src: p05, kind: "pdf" },
            { id: "p6", label: "6 Display", src: p06, kind: "pdf" },
            { id: "p7", label: "7 Tryckluft och broms", src: p07, kind: "pdf" },
            { id: "p8", label: "8 Avställning av loket", src: p08, kind: "pdf" },
            { id: "p9", label: "9 AFB", src: p09, kind: "pdf" },
            { id: "p10", label: "10 Dörrstyrning", src: p10, kind: "pdf" },
            { id: "p11", label: "11 Övergång", src: p11, kind: "pdf" },
            { id: "p12", label: "12 ATC2_L10000", src: p12, kind: "pdf" },
            { id: "p13", label: "13 Jordning av lok", src: p13, kind: "pdf" },
            { id: "p14", label: "14 Felsökning", src: p14, kind: "pdf" },
        ],
        []
    );

    // Dina extra-bilder kan ligga kvar i public/ som innan
    const extraItems = useMemo<DocItem[]>(
        () => [
            { id: "e1", label: "Extra 1", src: "/lokimg/extra1.jpg", kind: "image" },
            { id: "e2", label: "Extra 2", src: "/lokimg/extra2.jpg", kind: "image" },
            { id: "e3", label: "Extra 3", src: "/lokimg/extra3.jpg", kind: "image" },
            { id: "e4", label: "Extra 4", src: "/lokimg/extra4.jpg", kind: "image" },
            { id: "e5", label: "Extra 5", src: "/lokimg/extra5.jpg", kind: "image" },
            { id: "e6", label: "Extra 6", src: "/lokimg/extra6.jpg", kind: "image" },
            { id: "e7", label: "Extra 7", src: "/lokimg/extra7.jpg", kind: "image" },
            { id: "e8", label: "Extra 8", src: "/lokimg/extra8.jpg", kind: "image" },
            { id: "e9", label: "Extra 9", src: "/lokimg/extra9.jpg", kind: "image" },
            { id: "e10", label: "Extra 10", src: "/lokimg/extra10.jpg", kind: "image" },
        ],
        []
    );

    const allItems = useMemo(() => [...pdfItems, ...extraItems], [pdfItems, extraItems]);

    const [activeId, setActiveId] = useState(allItems[0]?.id ?? "");
    const active = allItems.find((x) => x.id === activeId);

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ margin: "0 0 12px" }}>Lok</h2>

            <div style={{ marginBottom: 10, fontWeight: 700 }}>PDF</div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                {pdfItems.map((it) => {
                    const isActive = it.id === activeId;
                    return (
                        <button
                            key={it.id}
                            onClick={() => setActiveId(it.id)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 12,
                                border: "1px solid #ddd",
                                background: isActive ? "#000000" : "var(--bg)",
                                color: isActive ? "#fff" : "var(--text)",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {it.label}
                        </button>
                    );
                })}
            </div>

            <div style={{ marginBottom: 10, fontWeight: 700 }}>Extra</div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                {extraItems.map((it) => {
                    const isActive = it.id === activeId;
                    return (
                        <button
                            key={it.id}
                            onClick={() => setActiveId(it.id)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 12,
                                border: "1px solid #ddd",
                                background: isActive ? "#000000" : "var(--bg)",
                                color: isActive ? "#fff" : "var(--text)",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {it.label}
                        </button>
                    );
                })}
            </div>

            <div
                style={{
                    border: "1px solid #eee",
                    borderRadius: 14,
                    padding: 10,
                    background: "#fafafa",
                }}
            >
                {!active ? (
                    <div>Ingen vald.</div>
                ) : active.kind === "pdf" ? (
                    <>
                        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>
                            Visar PDF: <b>{active.label}</b>{" "}
                            <a href={active.src} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>
                                Öppna i ny flik
                            </a>
                        </div>

                        <iframe
                            src={active.src}
                            title={active.label}
                            style={{
                                width: "100%",
                                height: "70vh",
                                border: 0,
                                borderRadius: 12,
                                background: "#fff",
                            }}
                        />
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>
                            Visar: <b>{active.label}</b>
                        </div>
                        <img
                            src={active.src}
                            alt={active.label}
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                borderRadius: 12,
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
