// src/atc/AtcSthBox.tsx
import { calcTotals, useTrainStore } from "../store/TrainStore";
import { lookupSthForLine } from "./sthLookup";
import { getTillsattningstidSeconds } from "./tillsattningstid";
import { lookupRetardation } from "./retardationLookup";

function calcBpPercent(totalBrakeT: number, totalWeightT: number) {
    const brake = Math.floor(totalBrakeT);
    const weight = Math.ceil(totalWeightT);
    return weight > 0 ? Math.floor((brake / weight) * 100) : 0;
}

export default function AtcSthBox() {
    // trigga rerender när tåget ändras
    const cars = useTrainStore((s) => s.cars);


    const totals = calcTotals();
    const bp = calcBpPercent(totals.totalBrakeT, totals.totalWeightT);

    // ✅ Tillsättningstid baserat på tågets faktiska längd (påbörjad 100m)
    const tillsTidSec = getTillsattningstidSeconds(totals.totalLengthM);

    // ✅ Retardation baserat på bromsprocent (du fyller tabellen själv)
    const retard = lookupRetardation(bp);

    const lines = ["A", "B", "C", "U", "T"] as const;

    return (
        <div
            style={{
                border: "2px solid #000",
                borderRadius: 14,
                padding: 12,
                background: "var(--bg)",
                marginBottom: 12,
            }}
        >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>ATC: Högsta tillåtna STH</div>

            {/* ✅ Ny info-rad högst upp */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                    BP: <b>{bp}%</b>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Längd: <b>{Math.ceil(totals.totalLengthM)} m</b>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Tillsättningstid: <b>{tillsTidSec} s</b>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Retardation: <b>{retard === null ? "—" : retard}</b>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                    • Vagnar: <b>{cars.length}</b>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {lines.map((line) => {
                    const sth = lookupSthForLine(line, bp, totals.totalLengthM);
                    return (
                        <div
                            key={line}
                            style={{
                                border: "2px solid #000",
                                borderRadius: 12,
                                padding: 10,
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: 18, fontWeight: 900 }}>{line}</div>
                            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>
                                {sth === null ? "—" : sth}
                            </div>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>km/h</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                Om en ruta visar <b>—</b> betyder det att tabell-intervallen saknas för just den kombinationen.
            </div>
        </div>
    );
}
