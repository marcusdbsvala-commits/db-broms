import { calcTotals, useTrainStore, type BrakeMode } from "../store/TrainStore";
import BrakeSummaryForm from "../ui/BrakeSummaryForm";

function calcBrakePercentSelected(totalBrakeT: number, totalWeightT: number) {
    const brake = Math.floor(totalBrakeT);
    const weight = Math.ceil(totalWeightT);
    const percent = weight > 0 ? Math.floor((brake / weight) * 100) : 0;
    return { brake, weight, percent };
}

export default function Broms() {
    const wagonTypes = useTrainStore((s) => s.wagonTypes);
    const locTypes = useTrainStore((s) => s.locTypes);

    const selectedLocId = useTrainStore((s) => s.selectedLocId);
    const setSelectedLoc = useTrainStore((s) => s.setSelectedLoc);

    const locBrakeMode = useTrainStore((s) => s.locBrakeMode);
    const setLocBrakeMode = useTrainStore((s) => s.setLocBrakeMode);

    const cars = useTrainStore((s) => s.cars);
    const addCar = useTrainStore((s) => s.addCar);
    const removeCar = useTrainStore((s) => s.removeCar);
    const removeCarById = useTrainStore((s) => s.removeCarById);

    const setCarBrakeMode = useTrainStore((s) => s.setCarBrakeMode);
    const setCarBrakeEnabled = useTrainStore((s) => s.setCarBrakeEnabled);
    const setCarTareOverride = useTrainStore((s) => s.setCarTareOverride);

    const totals = calcTotals();
    const bp = calcBrakePercentSelected(totals.totalBrakeT, totals.totalWeightT);

    // --- Lokdata (aktivt dragfordon) ---
    const loc = selectedLocId ? locTypes[selectedLocId] : null;
    const locLengthM = loc?.lengthM ?? 0;
    const locWeightT = loc?.tareT ?? 0;
    const locBrakeT = totals.locBrakeSelected ?? 0;

    // --- Övriga fordon (vagnar) ---
    const otherLengthM = Math.max(0, totals.totalLengthM - locLengthM);
    const otherLengthCeilM = Math.ceil(otherLengthM);
    const sumLengthM_form = locLengthM + otherLengthCeilM;

    const otherWeightT = Math.ceil(Math.max(0, totals.totalWeightT - locWeightT));
    const locWeightCeilT = Math.ceil(locWeightT);
    const sumWeightT_form = locWeightCeilT + otherWeightT;

    const otherBrakeT = Math.max(0, totals.totalBrakeT - locBrakeT);

    const otherAxles = totals.totalAxles;
    const dDiscAxles = totals.totalDiscAxles;

    // 2.D längd = skivbromsade vagnar
    let dDiscLengthM = 0;
    for (const car of cars) {
        const w = wagonTypes[car.wagonTypeId];
        if (!w) continue;
        if (w.hasBlockBrake) continue;
        dDiscLengthM += w.lengthM;
    }
    const dDiscLengthCeilM = Math.ceil(dDiscLengthM);

    // Lokval under "Bygg tåget"
    const locoIncluded = !!selectedLocId;
    const locoOptions = Object.values(locTypes);

    return (
        <div style={{ padding: 16 }}>
            <h2>Broms</h2>

            <BrakeSummaryForm
                totals={totals}
                bpPercent={bp.percent}
                locLengthM={locLengthM}
                locWeightT={locWeightT}
                locBrakeT={locBrakeT}
                otherAxles={otherAxles}
                otherLengthCeilM={otherLengthCeilM}
                otherWeightT={otherWeightT}
                otherBrakeT={otherBrakeT}
                sumWeightT_form={sumWeightT_form}
                dDiscAxles={dDiscAxles}
                dDiscLengthCeilM={dDiscLengthCeilM}
                sumLengthM_form={sumLengthM_form}
            />

            {/* Bygg tåg */}
            <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Bygg tåget</div>

                {/* Lok som val */}
                <div
                    style={{
                        padding: 8,
                        border: "1px solid #000000",
                        borderRadius: 12,
                        marginBottom: 12,
                    }}
                >
                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                            type="checkbox"
                            checked={locoIncluded}
                            onChange={(e) => {
                                if (!e.target.checked) setSelectedLoc(null);
                                else setSelectedLoc(locoOptions[0]?.id ?? null);
                            }}
                        />
                        (aktivt dragfordon)
                    </label>

                    {locoIncluded && (
                        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <select value={selectedLocId ?? ""} onChange={(e) => setSelectedLoc(e.target.value || null)}>
                                {locoOptions.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name} — {l.lengthM} m, {l.tareT} t
                                    </option>
                                ))}
                            </select>

                            <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 700 }}>Lokbroms:</div>

                            <select
                                value={locBrakeMode}
                                onChange={(e) => setLocBrakeMode(e.target.value as BrakeMode)}
                                style={{ padding: "8px 10px", borderRadius: 10, border: "2px solid #000", fontWeight: 800 }}
                            >
                                <option value="P">P</option>
                                <option value="R">R</option>
                                <option value="EP">EP</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Snabbbygg: + / - per typ */}
                {Object.values(wagonTypes).map((w) => {
                    const count = cars.filter((c) => c.wagonTypeId === w.id).length;

                    return (
                        <div
                            key={w.id}
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                padding: 8,
                                border: "1px solid #000000",
                                borderRadius: 12,
                                marginBottom: 8,
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div>
                                    <b>{w.name}</b> ({w.lengthM} m, {w.tareT} t)
                                </div>
                            </div>

                            <button
                                onClick={() => removeCar(w.id)}
                                style={{
                                    background: "var(--bg)",
                                    border: "2px solid #000000",
                                    color: "var(--text)",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    outline: "none",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                }}
                            >
                                -
                            </button>

                            <div
                                style={{
                                    width: 28,
                                    textAlign: "center",
                                    background: "var(--bg)",
                                    border: "2px solid #cc0000",
                                    color: "var(--accent)",
                                    borderRadius: 6,
                                    padding: "10px 14px",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                }}
                            >
                                {count}
                            </div>

                            <button
                                onClick={() => addCar(w.id)}
                                style={{
                                    background: "var(--bg)",
                                    border: "2px solid #000000",
                                    color: "var(--text)",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    outline: "none",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                }}
                            >
                                +
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Uppställning (instanser) */}
            <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Uppställning (per vagn)</div>

                {cars.length === 0 ? (
                    <div style={{ opacity: 0.7 }}>Inga vagnar tillagda än.</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {cars.map((car, idx) => {
                            const w = wagonTypes[car.wagonTypeId];
                            if (!w) return null;

                            const tareThis = car.tareOverrideT ?? w.tareT;

                            const selectedBrakeThisCar =
                                car.brakeEnabled
                                    ? car.brakeMode === "P"
                                        ? w.brakeP
                                        : car.brakeMode === "R"
                                            ? w.brakeR
                                            : (w.epBrake ?? 0)
                                    : 0;

                            return (
                                <div
                                    key={car.id}
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        alignItems: "center",
                                        padding: 8,
                                        border: "1px solid #000",
                                        borderRadius: 12,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div style={{ width: 34, textAlign: "center", fontWeight: 800 }}>{idx + 1}</div>

                                    <div style={{ flex: 1, minWidth: 170 }}>
                                        <div style={{ fontWeight: 800 }}>{w.name}</div>
                                        <div style={{ fontSize: 12, opacity: 0.75 }}>
                                            {w.lengthM} m • {tareThis} t • Broms: <b>{selectedBrakeThisCar}</b> t
                                        </div>
                                    </div>

                                    {/* Bara för BR193 i transport: viktval 90/95 */}
                                    {car.wagonTypeId === "br193" && (
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                            <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 700 }}>Vikt:</div>
                                            <select
                                                value={(car.tareOverrideT ?? 90).toString()}
                                                onChange={(e) => setCarTareOverride(car.id, Number(e.target.value))}
                                                style={{ padding: "8px 10px", borderRadius: 10, border: "2px solid #000", fontWeight: 800 }}
                                            >
                                                <option value="90">90 t</option>
                                                <option value="95">95 t</option>
                                            </select>
                                        </div>
                                    )}

                                    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                        <input
                                            type="checkbox"
                                            checked={car.brakeEnabled}
                                            onChange={(e) => setCarBrakeEnabled(car.id, e.target.checked)}
                                        />
                                        Broms
                                    </label>

                                    <select
                                        value={car.brakeMode}
                                        disabled={!car.brakeEnabled}
                                        onChange={(e) => setCarBrakeMode(car.id, e.target.value as BrakeMode)}
                                        style={{ padding: "8px 10px", borderRadius: 10, border: "2px solid #000", fontWeight: 800 }}
                                    >
                                        <option value="P">P</option>
                                        <option value="R">R</option>
                                        <option value="EP">EP</option>
                                    </select>

                                    <button
                                        onClick={() => removeCarById(car.id)}
                                        style={{
                                            background: "var(--bg)",
                                            border: "2px solid #000000",
                                            color: "rgb(0, 0, 0)",
                                            borderRadius: 8,
                                            padding: "8px 12px",
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            outline: "none",
                                            appearance: "none",
                                            WebkitAppearance: "none",
                                        }}
                                        title="Ta bort vagnen"
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
