// src/atc/sthLookup.ts
import { STH_TABLES, type LineCode, type LengthBand } from "./sthTables";
import { useTrainStore } from "../store/TrainStore";

/** Påbörjad hundrameter-band (1..100 => 0-100, 101..200 => 101-200 osv) */
export function getLengthBand(totalLengthM: number): LengthBand {
    const m = Math.ceil(totalLengthM);

    if (m <= 100) return "0-100";
    if (m <= 200) return "101-200";
    if (m <= 300) return "201-300";
    if (m <= 400) return "301-400";
    return "401-460"; // clamp
}

/**
 * FULL EP-bromsat enligt din logik:
 * - lok måste vara med och stå i EP
 * - alla vagninstanser måste ha broms på + EP
 * (om någon vagn har broms av => då INTE full EP)
 */
export function isFullyEPBraked(): boolean {
    const s = useTrainStore.getState();
    if (!s.selectedLocId) return false;
    if (s.locBrakeMode !== "EP") return false;
    return s.cars.length > 0 ? s.cars.every((c) => c.brakeEnabled && c.brakeMode === "EP") : true;
}

/** Slår upp STH för en bana baserat på bp% och längd + EP-regeln */
export function lookupSthForLine(line: LineCode, bpPercent: number, totalLengthM: number): number | null {
    const ep = isFullyEPBraked();
    const band: LengthBand = ep ? "0-100" : getLengthBand(totalLengthM);

    const rules = STH_TABLES[line][band];

    // hitta första regel som matchar intervallet
    const hit = rules.find((r) => bpPercent >= r.minBp && bpPercent <= r.maxBp);
    return hit ? hit.sth : null; // null => du har inte fyllt tabellen för det intervallet än
}
