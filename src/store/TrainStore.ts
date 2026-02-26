import { create } from "zustand";

/* =========================
   Types
========================= */

export type WagonType = {
    id: string;
    name: string;
    lengthM: number;
    tareT: number;
    brakeP: number;
    brakeR: number;
    epBrake?: number;

    hasBlockBrake: boolean;
    axles: number;
    maxSpeed: number;
};

export type LocType = {
    id: string;
    name: string;
    lengthM: number;
    tareT: number;
    brakeP: number;
    brakeR: number;
    epBrake?: number;
};

export type BrakeMode = "P" | "R" | "EP";

/* =========================
   Bpmmz individer
========================= */

export type BpmmzUnit = {
    id: string;
    label: string;
    brakeP: number;
    brakeR: number;
    epBrake?: number;
    tareT?: number;
};

export const BPMMZ_UNITS: BpmmzUnit[] = [
    { id: "90100", label: "90100", brakeP: 52, brakeR: 68, epBrake: 73, tareT: 50 },
    { id: "90101", label: "90101", brakeP: 54, brakeR: 71, epBrake: 76, tareT: 51 },
    { id: "90102", label: "90102", brakeP: 52, brakeR: 68, epBrake: 73, tareT: 50 },
    { id: "90103", label: "90103", brakeP: 54, brakeR: 71, epBrake: 76, tareT: 50 },
    { id: "90104", label: "90104", brakeP: 52, brakeR: 68, epBrake: 73, tareT: 50 },
    { id: "90105", label: "90105", brakeP: 52, brakeR: 68, epBrake: 73, tareT: 50 },
    { id: "90106", label: "90106", brakeP: 52, brakeR: 68, epBrake: 73, tareT: 50 },
    { id: "90107", label: "90107", brakeP: 54, brakeR: 71, epBrake: 76, tareT: 50 },
    { id: "90108", label: "90108", brakeP: 52, brakeR: 68, epBrake: 73, tareT: 50 },
    { id: "90109", label: "90109", brakeP: 54, brakeR: 71, epBrake: 76, tareT: 50 },
    { id: "90110", label: "90110", brakeP: 54, brakeR: 71, epBrake: 76, tareT: 51 },
];

function findBpmmzUnit(unitId?: string) {
    if (!unitId) return undefined;
    return BPMMZ_UNITS.find((u) => u.id === unitId);
}

/* =========================
   Train instance (per vagn)
========================= */

export type TrainCar = {
    id: string;
    wagonTypeId: string;

    brakeEnabled: boolean;
    brakeMode: BrakeMode;

    // valfri vikt-override (t.ex. BR193 i transport 90/95)
    tareOverrideT?: number;

    // ✅ Bpmmz: individ + broms overrides (på instansnivå)
    unitId?: string;
    brakeOverrideP?: number;
    brakeOverrideR?: number;
    brakeOverrideEP?: number;
};

/* =========================
   Presets (sparade tåg)
========================= */

export type TrainSnapshot = {
    selectedLocId: string | null;
    locBrakeMode: BrakeMode;
    cars: TrainCar[];
};

export type TrainPreset = {
    id: string;
    name: string;
    createdAt: number;
    snapshot: TrainSnapshot;
};

/* =========================
   Share / Export-Import
========================= */

export type SharePayloadV1 = {
    v: 1;
    preset: TrainPreset;
};

function encodeSharePayload(payload: SharePayloadV1): string {
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
}

function decodeSharePayload(code: string): SharePayloadV1 {
    const bin = atob(code.trim());
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as SharePayloadV1;
}

/* =========================
   LocalStorage helpers
========================= */

const PRESETS_KEY = "broms_pwa_presets_v1";
const LAST_KEY = "broms_pwa_last_train_v1";

function safeJsonParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function loadPresetsFromStorage(): TrainPreset[] {
    const parsed = safeJsonParse<TrainPreset[]>(localStorage.getItem(PRESETS_KEY));
    return Array.isArray(parsed) ? parsed : [];
}

function savePresetsToStorage(presets: TrainPreset[]) {
    try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    } catch {
        // ignore
    }
}

function loadLastFromStorage(): TrainSnapshot | null {
    return safeJsonParse<TrainSnapshot>(localStorage.getItem(LAST_KEY));
}

function saveLastToStorage(snapshot: TrainSnapshot) {
    try {
        localStorage.setItem(LAST_KEY, JSON.stringify(snapshot));
    } catch {
        // ignore
    }
}

/* =========================
   Store
========================= */

type State = {
    wagonTypes: Record<string, WagonType>;
    locTypes: Record<string, LocType>;

    // Aktivt dragfordon (lok)
    selectedLocId: string | null;
    locBrakeMode: BrakeMode;

    // Instanser av vagnar
    cars: TrainCar[];

    // ✅ Presets
    presets: TrainPreset[];

    // Lok
    setSelectedLoc: (locId: string | null) => void;
    setLocBrakeMode: (mode: BrakeMode) => void;
    getLocOptions: () => LocType[];

    // Vagn-katalog
    upsertWagonType: (w: WagonType) => void;
    deleteWagonType: (id: string) => void;

    // Bygga tåget
    addCar: (wagonTypeId: string) => void;
    removeCar: (wagonTypeId: string) => void;
    removeCarById: (carId: string) => void;

    // Broms per instans
    setCarBrakeMode: (carId: string, mode: BrakeMode) => void;
    setCarBrakeEnabled: (carId: string, enabled: boolean) => void;

    // Vikt override per instans
    setCarTareOverride: (carId: string, tareT: number | null) => void;

    // ✅ Bpmmz
    getBpmmzUnits: () => BpmmzUnit[];
    setCarUnitId: (carId: string, unitId: string | null) => void;
    getCarBpmmzUnitLabel: (car: TrainCar) => string | null;

    // ✅ Presets actions
    savePreset: (name: string) => void;
    loadPreset: (presetId: string) => void;
    deletePreset: (presetId: string) => void;
    renamePreset: (presetId: string, name: string) => void;
    clearPresets: () => void;

    // ✅ Export / Import
    exportPresetCode: (presetId: string) => string | null;
    importPresetCode: (code: string) => { ok: true; id: string } | { ok: false; error: string };
};

function makeSnapshot(s: Pick<State, "selectedLocId" | "locBrakeMode" | "cars">): TrainSnapshot {
    return {
        selectedLocId: s.selectedLocId,
        locBrakeMode: s.locBrakeMode,
        cars: s.cars,
    };
}

function persistLastFromState(s: Pick<State, "selectedLocId" | "locBrakeMode" | "cars">) {
    saveLastToStorage(makeSnapshot(s));
}

const last = loadLastFromStorage();

export const useTrainStore = create<State>((set, get) => ({
    wagonTypes: {
        ab3k: {
            id: "ab3k",
            name: "AB3K",
            lengthM: 24.1,
            tareT: 43,
            brakeP: 49,
            brakeR: 66,
            epBrake: 0,
            hasBlockBrake: true,
            axles: 4,
            maxSpeed: 160,
        },
        b1k: {
            id: "b1k",
            name: "B1K",
            lengthM: 24.1,
            tareT: 44,
            brakeP: 49,
            brakeR: 65,
            epBrake: 0,
            hasBlockBrake: true,
            axles: 4,
            maxSpeed: 160,
        },
        bc2: {
            id: "bc2",
            name: "BC2 3478-3799",
            lengthM: 23.5,
            tareT: 43,
            brakeP: 49,
            brakeR: 65,
            epBrake: 0,
            hasBlockBrake: true,
            axles: 4,
            maxSpeed: 160,
        },
        bc2k: {
            id: "bc2k",
            name: "BC2K 3919-4011",
            lengthM: 23.5,
            tareT: 46,
            brakeP: 53,
            brakeR: 68,
            epBrake: 0,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 160,
        },
        bc2k1: {
            id: "bc2k1",
            name: "BC2K 4032,4053",
            lengthM: 23.5,
            tareT: 46,
            brakeP: 50,
            brakeR: 66,
            epBrake: 0,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 160,
        },
        f24: {
            id: "f24",
            name: "F24 (normalt i P)",
            lengthM: 16,
            tareT: 31,
            brakeP: 31,
            brakeR: 38,
            epBrake: 0,
            hasBlockBrake: true,
            axles: 4,
            maxSpeed: 160,
        },
        db: {
            id: "db",
            name: "DB",
            lengthM: 24.1,
            tareT: 37,
            brakeP: 40,
            brakeR: 52,
            epBrake: 0,
            hasBlockBrake: true,
            axles: 4,
            maxSpeed: 160,
        },
        r7: {
            id: "r7",
            name: "R7 5634 broms avstängd",
            lengthM: 23.5,
            tareT: 40,
            brakeP: 0,
            brakeR: 0,
            epBrake: 0,
            hasBlockBrake: true,
            axles: 4,
            maxSpeed: 160,
        },
        bmz1: {
            id: "bmz1",
            name: "Bmz 1",
            lengthM: 26.4,
            tareT: 48,
            brakeP: 47,
            brakeR: 62,
            epBrake: 68,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },
        bmz2: {
            id: "bmz2",
            name: "Bmz 2",
            lengthM: 26.4,
            tareT: 48,
            brakeP: 47,
            brakeR: 62,
            epBrake: 68,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },
        bmz3: {
            id: "bmz3",
            name: "Bmz 3",
            lengthM: 26.4,
            tareT: 48,
            brakeP: 47,
            brakeR: 62,
            epBrake: 68,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },
        bmpz: {
            id: "bmpz",
            name: "Bmpz",
            lengthM: 26.4,
            tareT: 47.9,
            brakeP: 53,
            brakeR: 68,
            epBrake: 73,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },

        // ✅ Bpmmz - grund
        bpmmz: {
            id: "bpmmz",
            name: "Bpmmz",
            lengthM: 26.4,
            tareT: 50,
            brakeP: 52,
            brakeR: 68,
            epBrake: 73,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },

        bvcmz: {
            id: "bvcmz",
            name: "Bvcmz",
            lengthM: 26.4,
            tareT: 51,
            brakeP: 53,
            brakeR: 74,
            epBrake: 77,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },
        wrbmz: {
            id: "wrbmz",
            name: "WRbmz",
            lengthM: 26.4,
            tareT: 47.9,
            brakeP: 53,
            brakeR: 68,
            epBrake: 73,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },
        arkimbz: {
            id: "arkimbz",
            name: "ARkimbz",
            lengthM: 26.4,
            tareT: 56,
            brakeP: 59,
            brakeR: 84,
            epBrake: 87,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },

        // Lok i transport som "vagn"
        br193: {
            id: "br193",
            name: "BR193 (i transport)",
            lengthM: 19,
            tareT: 95,
            brakeP: 95,
            brakeR: 135,
            epBrake: 135,
            hasBlockBrake: false,
            axles: 4,
            maxSpeed: 200,
        },
    },

    locTypes: {
        loc1: {
            id: "loc1",
            name: "BR193",
            lengthM: 19,
            tareT: 95,
            brakeP: 95,
            brakeR: 135,
            epBrake: 135,
        },
    },

    selectedLocId: last?.selectedLocId ?? null,
    locBrakeMode: last?.locBrakeMode ?? "EP",
    cars: last?.cars ?? [],
    presets: loadPresetsFromStorage(),

    setSelectedLoc: (locId) =>
        set((s) => {
            const next = { ...s, selectedLocId: locId };
            persistLastFromState(next);
            return { selectedLocId: locId };
        }),

    setLocBrakeMode: (mode) =>
        set((s) => {
            const next = { ...s, locBrakeMode: mode };
            persistLastFromState(next);
            return { locBrakeMode: mode };
        }),

    getLocOptions: () => Object.values(get().locTypes),

    upsertWagonType: (w) =>
        set((s) => ({
            wagonTypes: { ...s.wagonTypes, [w.id]: w },
        })),

    deleteWagonType: (id) =>
        set((s) => {
            const wt = { ...s.wagonTypes };
            delete wt[id];
            const cars = s.cars.filter((c) => c.wagonTypeId !== id);
            const next = { ...s, cars };
            persistLastFromState(next);
            return { wagonTypes: wt, cars };
        }),

    addCar: (wagonTypeId) =>
        set((s) => {
            const brakeEnabled = wagonTypeId === "r7" ? false : true;

            const w = s.wagonTypes[wagonTypeId];
            const brakeMode: BrakeMode = w && (w.epBrake ?? 0) > 0 ? "EP" : "R";

            const tareOverrideT = wagonTypeId === "br193" ? 90 : undefined;
            const defaultUnit = wagonTypeId === "bpmmz" ? BPMMZ_UNITS[0] : undefined;

            const newCar: TrainCar = {
                id: crypto.randomUUID(),
                wagonTypeId,
                brakeEnabled,
                brakeMode,
                tareOverrideT: defaultUnit?.tareT ?? tareOverrideT,
                unitId: defaultUnit?.id,
                brakeOverrideP: defaultUnit?.brakeP,
                brakeOverrideR: defaultUnit?.brakeR,
                brakeOverrideEP: defaultUnit?.epBrake ?? (defaultUnit ? 0 : undefined),
            };

            const cars = [...s.cars, newCar];
            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    removeCar: (wagonTypeId) =>
        set((s) => {
            const revIdx = [...s.cars].reverse().findIndex((c) => c.wagonTypeId === wagonTypeId);
            if (revIdx === -1) return s;
            const idx = s.cars.length - 1 - revIdx;
            const cars = [...s.cars];
            cars.splice(idx, 1);
            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    removeCarById: (carId) =>
        set((s) => {
            const cars = s.cars.filter((c) => c.id !== carId);
            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    setCarBrakeMode: (carId, mode) =>
        set((s) => {
            const cars = s.cars.map((c) => (c.id === carId ? { ...c, brakeMode: mode } : c));
            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    setCarBrakeEnabled: (carId, enabled) =>
        set((s) => {
            const cars = s.cars.map((c) => (c.id === carId ? { ...c, brakeEnabled: enabled } : c));
            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    setCarTareOverride: (carId, tareT) =>
        set((s) => {
            const cars = s.cars.map((c) =>
                c.id === carId ? { ...c, tareOverrideT: tareT === null ? undefined : tareT } : c
            );
            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    getBpmmzUnits: () => BPMMZ_UNITS,

    setCarUnitId: (carId, unitId) =>
        set((s) => {
            const car = s.cars.find((c) => c.id === carId);
            if (!car) return s;

            if (car.wagonTypeId !== "bpmmz") {
                const cars = s.cars.map((c) => (c.id === carId ? { ...c, unitId: unitId ?? undefined } : c));
                const next = { ...s, cars };
                persistLastFromState(next);
                return { cars };
            }

            const u = unitId ? BPMMZ_UNITS.find((x) => x.id === unitId) : undefined;

            const cars = s.cars.map((c) => {
                if (c.id !== carId) return c;

                if (!u) {
                    return {
                        ...c,
                        unitId: undefined,
                        brakeOverrideP: undefined,
                        brakeOverrideR: undefined,
                        brakeOverrideEP: undefined,
                    };
                }

                return {
                    ...c,
                    unitId: u.id,
                    brakeOverrideP: u.brakeP,
                    brakeOverrideR: u.brakeR,
                    brakeOverrideEP: u.epBrake ?? 0,
                    tareOverrideT: u.tareT ?? c.tareOverrideT,
                };
            });

            const next = { ...s, cars };
            persistLastFromState(next);
            return { cars };
        }),

    getCarBpmmzUnitLabel: (car) => {
        if (car.wagonTypeId !== "bpmmz") return null;
        const u = findBpmmzUnit(car.unitId);
        return u?.label ?? null;
    },

    savePreset: (name) =>
        set((s) => {
            const preset: TrainPreset = {
                id: crypto.randomUUID(),
                name: name.trim() || `Tåg ${new Date().toLocaleString("sv-SE")}`,
                createdAt: Date.now(),
                snapshot: makeSnapshot(s),
            };

            const presets = [preset, ...s.presets];
            savePresetsToStorage(presets);
            return { presets };
        }),

    loadPreset: (presetId) =>
        set((s) => {
            const p = s.presets.find((x) => x.id === presetId);
            if (!p) return s;

            const selectedLocId = p.snapshot.selectedLocId;
            const locBrakeMode = p.snapshot.locBrakeMode;
            const cars = p.snapshot.cars;

            const next = { ...s, selectedLocId, locBrakeMode, cars };
            persistLastFromState(next);

            return { selectedLocId, locBrakeMode, cars };
        }),

    deletePreset: (presetId) =>
        set((s) => {
            const presets = s.presets.filter((p) => p.id !== presetId);
            savePresetsToStorage(presets);
            return { presets };
        }),

    renamePreset: (presetId, name) =>
        set((s) => {
            const n = name.trim();
            const presets = s.presets.map((p) => (p.id === presetId && n ? { ...p, name: n } : p));
            savePresetsToStorage(presets);
            return { presets };
        }),

    clearPresets: () =>
        set(() => {
            savePresetsToStorage([]);
            return { presets: [] };
        }),

    // ✅ Export / Import
    exportPresetCode: (presetId) => {
        const s = get();
        const p = s.presets.find((x) => x.id === presetId);
        if (!p) return null;

        const payload: SharePayloadV1 = { v: 1, preset: p };
        return encodeSharePayload(payload);
    },

    importPresetCode: (code) => {
        try {
            const payload = decodeSharePayload(code);

            if (!payload || payload.v !== 1 || !payload.preset) {
                return { ok: false as const, error: "Ogiltig kod (fel format)." };
            }

            const incoming = payload.preset;

            const cleaned: TrainPreset = {
                ...incoming,
                id: incoming.id || crypto.randomUUID(),
                createdAt: incoming.createdAt || Date.now(),
                name: (incoming.name || "").trim() || `Import ${new Date().toLocaleString("sv-SE")}`,
            };

            set((s) => {
                const exists = s.presets.some((p) => p.id === cleaned.id);
                const finalPreset = exists ? { ...cleaned, id: crypto.randomUUID() } : cleaned;
                const presets = [finalPreset, ...s.presets];
                savePresetsToStorage(presets);
                return { presets };
            });

            const newest = get().presets[0];
            return { ok: true as const, id: newest.id };
        } catch {
            return { ok: false as const, error: "Kunde inte läsa koden. (Fel/trasig kod)" };
        }
    },
}));

/* =========================
   Beräkningar
========================= */

export function calcTotals() {
    const { wagonTypes, locTypes, selectedLocId, locBrakeMode, cars } = useTrainStore.getState();

    const loc = selectedLocId ? locTypes[selectedLocId] : null;

    const locLen = loc?.lengthM ?? 0;
    const locTare = loc?.tareT ?? 0;

    const locBrakeSelected = loc
        ? locBrakeMode === "P"
            ? (loc.brakeP ?? 0)
            : locBrakeMode === "R"
                ? (loc.brakeR ?? 0)
                : (loc.epBrake ?? 0)
        : 0;

    let totalLengthM = locLen;
    let totalWeightT = locTare;
    let totalBrakeT = locBrakeSelected;

    let totalAxles = 0;
    let totalBlockAxles = 0;
    let minMaxSpeed: number | null = null;

    for (const car of cars) {
        const w = wagonTypes[car.wagonTypeId];
        if (!w) continue;

        totalLengthM += w.lengthM;

        const tareThis = car.tareOverrideT ?? w.tareT;
        totalWeightT += tareThis;

        totalAxles += w.axles;
        if (w.hasBlockBrake) totalBlockAxles += w.axles;

        if (minMaxSpeed === null) minMaxSpeed = w.maxSpeed;
        else minMaxSpeed = Math.min(minMaxSpeed, w.maxSpeed);

        if (car.brakeEnabled) {
            const b =
                car.brakeMode === "P"
                    ? (car.brakeOverrideP ?? w.brakeP)
                    : car.brakeMode === "R"
                        ? (car.brakeOverrideR ?? w.brakeR)
                        : (car.brakeOverrideEP ?? (w.epBrake ?? 0));

            totalBrakeT += b;
        }
    }

    return {
        totalLengthM,
        totalWeightT,
        totalBrakeT,

        totalAxles,
        totalBlockAxles,
        totalDiscAxles: totalAxles - totalBlockAxles,
        minMaxSpeed,

        hasActiveLoc: !!loc,
        activeLocName: loc?.name ?? null,

        locBrakeSelected,
        locBrakeMode,
    };
}

export type Totals = ReturnType<typeof calcTotals>;

/* =========================
   Plattform-hjälp
========================= */

export function approxCarsToFit(overM: number): number {
    if (overM <= 0) return 0;

    const { cars, wagonTypes } = useTrainStore.getState();
    let remaining = overM;
    let removed = 0;

    for (let i = cars.length - 1; i >= 0; i--) {
        const car = cars[i];
        const w = wagonTypes[car.wagonTypeId];
        if (!w) continue;

        removed += 1;
        remaining -= w.lengthM;
        if (remaining <= 0) return removed;
    }

    return removed;
}