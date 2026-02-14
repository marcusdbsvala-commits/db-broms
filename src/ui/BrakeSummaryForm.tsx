import "./BrakeSummaryForm.css";
import type { Totals } from "../store/TrainStore";
import React from "react";

type Props = {
    totals: Totals;
    bpPercent: number;

    locLengthM: number;
    locWeightT: number;
    locBrakeT: number;

    otherAxles: number;
    otherLengthCeilM: number;
    otherWeightT: number;
    otherBrakeT: number;

    sumWeightT_form: number;
    sumLengthM_form: number;

    dDiscAxles: number;
    dDiscLengthCeilM: number;
};

const cellBorder = "2px solid var(--form-border)";

function Field({ value }: { value: string }) {
    return (
        <div
            style={{
                height: 36,
                width: "100%",
                border: cellBorder,
                borderRadius: 8,
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontWeight: 800,
                background: "var(--form-field)",
                color: "var(--form-number)",
                fontVariantNumeric: "tabular-nums",
                boxSizing: "border-box",
            }}
        >
            {value}
        </div>
    );
}

function MiniField({ value }: { value: string }) {
    return (
        <div
            style={{
                height: 36,
                width: "100%",
                border: cellBorder,
                borderRadius: 8,
                padding: "0 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontWeight: 800,
                fontSize: 13,
                background: "var(--form-field)",
                color: "var(--form-number)",
                fontVariantNumeric: "tabular-nums",
                boxSizing: "border-box",
            }}
        >
            {value}
        </div>
    );
}

export default function BrakeSummaryForm({
    totals,
    bpPercent,

    locLengthM,
    locWeightT,
    locBrakeT,

    otherAxles,
    otherLengthCeilM,
    otherWeightT,
    otherBrakeT,

    sumWeightT_form,
    sumLengthM_form,

    dDiscAxles,
    dDiscLengthCeilM,
}: Props) {
    const totalBrakeSelected = Math.round((locBrakeT ?? 0) + (otherBrakeT ?? 0));

    const d = new Date();
    const todayStr = `${d.getDate()}/${d.getMonth() + 1} ${d.getFullYear()}`;

    const labelStyle: React.CSSProperties = { fontSize: 12, color: "var(--text)", opacity: 0.9 };

    return (
        <div className="brakeFormOuter">
            <div
                className="brakeFormPaper"
                style={{
                    border: cellBorder,
                    borderRadius: 16,
                    padding: 14,
                    background: "var(--form-paper)",
                    color: "var(--text)",
                    boxShadow: "var(--form-shadow)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 10,
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ minWidth: 220 }}>
                        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.2 }}>
                            Uppgift till förare
                        </div>
                        <div style={labelStyle}>(resandetåg)</div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ width: "min(44vw, 180px)" as any }}>
                            <div style={{ ...labelStyle, marginBottom: 4 }}>Tåg</div>
                            <div
                                style={{
                                    height: 36,
                                    border: cellBorder,
                                    borderRadius: 8,
                                    background: "var(--form-field)",
                                }}
                            />
                        </div>

                        <div style={{ width: "min(44vw, 180px)" as any }}>
                            <div style={{ ...labelStyle, marginBottom: 4 }}>Datum</div>
                            <Field value={todayStr} />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                        color: "var(--text)",
                    }}
                >
                    <thead>
                        <tr style={{ background: "var(--form-head)" }}>
                            <th style={{ width: "26%", padding: 6, border: cellBorder, textAlign: "left" }}>
                                1. Från trafikplats
                            </th>
                            <th style={{ width: "28%", padding: 6, border: cellBorder, textAlign: "left" }}>
                                Längd
                            </th>
                            <th style={{ width: "24%", padding: 6, border: cellBorder, textAlign: "left" }}>
                                Vikt<br />ton
                            </th>
                            <th style={{ width: "24%", padding: 6, border: cellBorder, textAlign: "left" }}>
                                Broms-<br />vikt ton
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td style={{ border: cellBorder, padding: 6, fontWeight: 900 }}>Verksamt dragfordon</td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${locLengthM}`} />
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${Math.round(locWeightT)}`} />
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${Math.round(locBrakeT)}`} />
                            </td>
                        </tr>

                        <tr style={{ background: "var(--form-head)" }}>
                            <td style={{ border: cellBorder, padding: 8, fontWeight: 900 }}>Övriga fordon</td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 6 }}>
                                    <MiniField value={`${otherAxles}`} />
                                    <MiniField value={`${otherLengthCeilM}`} />
                                </div>
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${otherWeightT}`} />
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${otherBrakeT}`} />
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: cellBorder, padding: 8, fontWeight: 900 }}>Summa</td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${sumLengthM_form}`} />
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${sumWeightT_form}`} />
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <Field value={`${totalBrakeSelected}`} />
                            </td>
                        </tr>

                        <tr style={{ background: "var(--form-head)" }}>
                            <td style={{ border: cellBorder, padding: 6, fontWeight: 900 }}>Tillgänglig bromsprocent</td>
                            <td style={{ border: cellBorder, padding: 8 }} colSpan={3}>
                                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                    <div style={{ width: 140 }}>
                                        <Field value={`${bpPercent}`} />
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--text)", opacity: 0.78 }}>

                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: cellBorder, padding: 8, fontWeight: 900 }}>Långsammaste fordon</td>
                            <td style={{ border: cellBorder, padding: 8 }} colSpan={3}>
                                <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 260 }}>
                                    <Field value={totals.minMaxSpeed ? `${totals.minMaxSpeed}` : ""} />
                                    <div style={{ color: "var(--text)", opacity: 0.78 }}>km/h</div>
                                </div>
                            </td>
                        </tr>

                        <tr style={{ background: "var(--form-head)" }}>
                            <td style={{ border: cellBorder, padding: 8, fontWeight: 900 }}>2. D</td>
                            <td style={{ border: cellBorder, padding: 8 }}>
                                <div style={{ fontSize: 11, color: "var(--text)", opacity: 0.78, marginBottom: 4 }}>
                                    axlar
                                </div>
                                <Field value={`${dDiscAxles}`} />
                            </td>
                            <td style={{ border: cellBorder, padding: 8 }} colSpan={2}>
                                <div style={{ fontSize: 11, color: "var(--text)", opacity: 0.78, marginBottom: 4 }}>
                                    meter
                                </div>
                                <Field value={`${dDiscLengthCeilM}`} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
