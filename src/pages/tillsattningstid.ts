// src/atc/tillsattningstid.ts
import type { LengthBand } from "./sthTables";
import { getLengthBand, isFullyEPBraked } from "./sthLookup";

/**
 * Regler:
 * - Om hela tåget är EP-bromsat => ALLTID 5 sek
 * - Annars: längdberoende
 */
export function getTillsattningstidSeconds(totalLengthM: number): number {
    // ✅ Specialregel: full EP => alltid 5 sek
    if (isFullyEPBraked()) {
        return 5;
    }

    // ❌ Annars: gå på längd
    const band: LengthBand = getLengthBand(totalLengthM);

    switch (band) {
        case "0-100":
            return 5;
        case "101-200":
            return 6;
        case "201-300":
            return 7;
        case "301-400":
            return 8;
        case "401-460":
            return 9;
        default:
            return 9;
    }
}
