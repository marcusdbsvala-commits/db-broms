// src/atc/retardationLookup.ts
import { RETARDATION_TABLE } from "./retardationTables";

export function lookupRetardation(bpPercent: number): number | null {
    const hit = RETARDATION_TABLE.find((r) => bpPercent >= r.minBp && bpPercent <= r.maxBp);
    return hit ? hit.retard : null;
}
