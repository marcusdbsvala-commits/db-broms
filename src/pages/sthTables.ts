// src/atc/sthTables.ts
export type LineCode = "A" | "B" | "C" | "U" | "T";

export type LengthBand = "0-100" | "101-200" | "201-300" | "301-400" | "401-460";

/**
 * En regel: om bpPercent ligger inom [minBp, maxBp] => returnera sth
 * Ex: 113-121 => 140
 */
export type BpRule = {
    minBp: number;
    maxBp: number;
    sth: number;
};

export type LineTables = {
    // Varje längd-band har en lista regler.
    // Reglerna ska täcka alla relevanta bp-intervall (du fyller i).
    [band in LengthBand]: BpRule[];
};

// ---- HÄR FYLLER DU I TABELLERNA ----
// Jag lägger bara in en EXEMPELREGEL så det compile:ar och du ser exakt formatet.
// Du kommer fylla på med resten av intervallen och STH.
export const STH_TABLES: Record<LineCode, LineTables> = {
    A: {
        "0-100":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 99, sth: 110 },
            { minBp: 100, maxBp: 118, sth: 120 },
            { minBp: 119, maxBp: 138, sth: 130 },
            { minBp: 139, maxBp: 143, sth: 170 },
            { minBp: 144, maxBp: 200, sth: 200 },
            ],
        "101-200":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 103, sth: 110 },
            { minBp: 104, maxBp: 124, sth: 120 },
            { minBp: 125, maxBp: 146, sth: 130 },
            { minBp: 147, maxBp: 200, sth: 200 },
            ],
        "201-300":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 107, sth: 110 },
            { minBp: 108, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 153, sth: 130 },
            { minBp: 154, maxBp: 200, sth: 200 },
            ],
        "301-400":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 68, sth: 70 },
            { minBp: 69, maxBp: 72, sth: 80 },
            { minBp: 73, maxBp: 74, sth: 90 },
            { minBp: 75, maxBp: 87, sth: 100 },
            { minBp: 88, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 200, sth: 130 },
            ],
        "401-460":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 69, sth: 70 },
            { minBp: 70, maxBp: 72, sth: 80 },
            { minBp: 73, maxBp: 75, sth: 90 },
            { minBp: 76, maxBp: 90, sth: 100 },
            { minBp: 91, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 132, sth: 120 },
            { minBp: 133, maxBp: 200, sth: 130 },
            ],
    },

    B: {
        "0-100":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 99, sth: 110 },
            { minBp: 100, maxBp: 118, sth: 120 },
            { minBp: 119, maxBp: 121, sth: 140 },
            { minBp: 122, maxBp: 124, sth: 150 },
            { minBp: 125, maxBp: 134, sth: 160 },
            { minBp: 135, maxBp: 143, sth: 170 },
            { minBp: 144, maxBp: 200, sth: 200 }
            ],
        "101-200":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 103, sth: 110 },
            { minBp: 104, maxBp: 124, sth: 120 },
            { minBp: 125, maxBp: 126, sth: 150 },
            { minBp: 127, maxBp: 137, sth: 160 },
            { minBp: 138, maxBp: 146, sth: 170 },
            { minBp: 147, maxBp: 200, sth: 200 }
            ],
        "201-300":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 107, sth: 110 },
            { minBp: 108, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 140, sth: 160 },
            { minBp: 141, maxBp: 150, sth: 170 },
            { minBp: 151, maxBp: 200, sth: 200 }
            ],
        "301-400":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 69, maxBp: 72, sth: 80 },
            { minBp: 73, maxBp: 74, sth: 90 },
            { minBp: 75, maxBp: 87, sth: 100 },
            { minBp: 88, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 132, sth: 150 },
            { minBp: 133, maxBp: 143, sth: 160 },
            { minBp: 144, maxBp: 153, sth: 170 },
            { minBp: 154, maxBp: 200, sth: 200 }
            ],
        "401-460":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 69, sth: 70 },
            { minBp: 70, maxBp: 72, sth: 80 },
            { minBp: 73, maxBp: 75, sth: 90 },
            { minBp: 76, maxBp: 90, sth: 100 },
            { minBp: 91, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 132, sth: 120 },
            { minBp: 133, maxBp: 134, sth: 140 },
            { minBp: 135, maxBp: 136, sth: 150 },
            { minBp: 137, maxBp: 147, sth: 160 },
            { minBp: 148, maxBp: 200, sth: 170 }
            ],
    },

    C: {
        "0-100":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 97, sth: 120 },
            { minBp: 98, maxBp: 112, sth: 130 },
            { minBp: 113, maxBp: 121, sth: 140 },
            { minBp: 122, maxBp: 124, sth: 150 },
            { minBp: 125, maxBp: 134, sth: 160 },
            { minBp: 135, maxBp: 143, sth: 170 },
            { minBp: 144, maxBp: 200, sth: 200 }],

        "101-200":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 99, sth: 120 },
            { minBp: 100, maxBp: 115, sth: 130 },
            { minBp: 116, maxBp: 124, sth: 140 },
            { minBp: 125, maxBp: 126, sth: 150 },
            { minBp: 127, maxBp: 137, sth: 160 },
            { minBp: 138, maxBp: 146, sth: 170 },
            { minBp: 147, maxBp: 200, sth: 200 }
            ],
        "201-300":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 71, sth: 80 },
            { minBp: 72, maxBp: 72, sth: 90 },
            { minBp: 73, maxBp: 102, sth: 120 },
            { minBp: 103, maxBp: 118, sth: 130 },
            { minBp: 119, maxBp: 126, sth: 140 },
            { minBp: 127, maxBp: 129, sth: 150 },
            { minBp: 130, maxBp: 140, sth: 160 },
            { minBp: 141, maxBp: 150, sth: 170 },
            { minBp: 151, maxBp: 200, sth: 200 }
            ],
        "301-400":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 68, sth: 70 },
            { minBp: 69, maxBp: 72, sth: 80 },
            { minBp: 73, maxBp: 74, sth: 90 },
            { minBp: 75, maxBp: 103, sth: 120 },
            { minBp: 104, maxBp: 119, sth: 130 },
            { minBp: 120, maxBp: 129, sth: 140 },
            { minBp: 130, maxBp: 132, sth: 150 },
            { minBp: 133, maxBp: 143, sth: 160 },
            { minBp: 144, maxBp: 153, sth: 170 },
            { minBp: 154, maxBp: 200, sth: 200 }
            ],
        "401-460":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 69, sth: 70 },
            { minBp: 70, maxBp: 72, sth: 80 },
            { minBp: 73, maxBp: 75, sth: 90 },
            { minBp: 76, maxBp: 106, sth: 120 },
            { minBp: 107, maxBp: 122, sth: 130 },
            { minBp: 123, maxBp: 134, sth: 140 },
            { minBp: 135, maxBp: 136, sth: 150 },
            { minBp: 137, maxBp: 147, sth: 160 },
            { minBp: 148, maxBp: 200, sth: 170 },

            ],
    },

    U: {
        "0-100":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 75, sth: 80 },
            { minBp: 76, maxBp: 77, sth: 90 },
            { minBp: 78, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 99, sth: 110 },
            { minBp: 100, maxBp: 118, sth: 120 },
            { minBp: 119, maxBp: 138, sth: 130 },
            { minBp: 139, maxBp: 143, sth: 170 },
            { minBp: 144, maxBp: 200, sth: 200 }],
        "101-200":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 78, sth: 80 },
            { minBp: 79, maxBp: 79, sth: 90 },
            { minBp: 80, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 103, sth: 110 },
            { minBp: 104, maxBp: 124, sth: 120 },
            { minBp: 125, maxBp: 146, sth: 130 },
            { minBp: 147, maxBp: 200, sth: 200 }],
        "201-300":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 66, sth: 70 },
            { minBp: 67, maxBp: 81, sth: 80 },
            { minBp: 82, maxBp: 82, sth: 90 },
            { minBp: 83, maxBp: 85, sth: 100 },
            { minBp: 86, maxBp: 107, sth: 110 },
            { minBp: 108, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 153, sth: 130 },
            { minBp: 154, maxBp: 200, sth: 200 }],
        "301-400":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 69, sth: 70 },
            { minBp: 70, maxBp: 82, sth: 80 },
            { minBp: 83, maxBp: 84, sth: 90 },
            { minBp: 85, maxBp: 87, sth: 100 },
            { minBp: 88, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 200, sth: 130 }],
        "401-460":
            [{ minBp: 1, maxBp: 60, sth: 0 },
            { minBp: 61, maxBp: 69, sth: 70 },
            { minBp: 70, maxBp: 90, sth: 80 },
            { minBp: 91, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 132, sth: 120 },
            { minBp: 133, maxBp: 200, sth: 130 }],
    },

    T: {
        "0-100":
            [{ minBp: 1, maxBp: 79, sth: 0 },
            { minBp: 80, maxBp: 87, sth: 50 },
            { minBp: 88, maxBp: 91, sth: 60 },
            { minBp: 92, maxBp: 96, sth: 70 },
            { minBp: 97, maxBp: 97, sth: 90 },
            { minBp: 98, maxBp: 99, sth: 110 },
            { minBp: 100, maxBp: 118, sth: 120 },
            { minBp: 119, maxBp: 138, sth: 130 },
            { minBp: 139, maxBp: 143, sth: 170 },
            { minBp: 144, maxBp: 200, sth: 200 }],
        "101-200":
            [{ minBp: 1, maxBp: 79, sth: 0 },
            { minBp: 80, maxBp: 87, sth: 50 },
            { minBp: 88, maxBp: 91, sth: 60 },
            { minBp: 92, maxBp: 99, sth: 70 },
            { minBp: 100, maxBp: 103, sth: 110 },
            { minBp: 104, maxBp: 124, sth: 120 },
            { minBp: 125, maxBp: 146, sth: 130 },
            { minBp: 147, maxBp: 200, sth: 200 }],
        "201-300":
            [{ minBp: 1, maxBp: 79, sth: 0 },
            { minBp: 80, maxBp: 81, sth: 40 },
            { minBp: 82, maxBp: 87, sth: 50 },
            { minBp: 88, maxBp: 91, sth: 60 },
            { minBp: 92, maxBp: 100, sth: 70 },
            { minBp: 101, maxBp: 107, sth: 110 },
            { minBp: 108, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 153, sth: 130 },
            { minBp: 154, maxBp: 200, sth: 200 }],
        "301-400":
            [{ minBp: 1, maxBp: 81, sth: 0 },
            { minBp: 82, maxBp: 89, sth: 50 },
            { minBp: 90, maxBp: 93, sth: 60 },
            { minBp: 94, maxBp: 102, sth: 70 },
            { minBp: 103, maxBp: 103, sth: 100 },
            { minBp: 104, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 129, sth: 120 },
            { minBp: 130, maxBp: 200, sth: 130 }],
        "401-460":
            [{ minBp: 1, maxBp: 81, sth: 0 },
            { minBp: 82, maxBp: 90, sth: 50 },
            { minBp: 91, maxBp: 94, sth: 60 },
            { minBp: 95, maxBp: 104, sth: 70 },
            { minBp: 105, maxBp: 109, sth: 110 },
            { minBp: 110, maxBp: 132, sth: 120 },
            { minBp: 133, maxBp: 200, sth: 130 }],
    },
};
