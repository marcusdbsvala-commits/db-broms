import { create } from "zustand";

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

// En instans i tåget (per vagn)
export type TrainCar = {
    id: string;
    wagonTypeId: string;

    brakeEnabled: boolean;
    brakeMode: BrakeMode;

    // valfri vikt-override (t.ex. BR193 i transport 90/95)
    tareOverrideT?: number;
};

type State = {
    wagonTypes: Record<string, WagonType>;
    locTypes: Record<string, LocType>;

    // Aktivt dragfordon (lok)
    selectedLocId: string | null;
    locBrakeMode: BrakeMode;

    // Instanser av vagnar
    cars: TrainCar[];

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
};

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
            tareT: 95, // katalogvärde, men instanser defaultar till 90 via tareOverrideT
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

    selectedLocId: null,

    // default lok-bromsläge (du ville EP default)
    locBrakeMode: "EP",

    cars: [],

    setSelectedLoc: (locId) => set({ selectedLocId: locId }),
    setLocBrakeMode: (mode) => set({ locBrakeMode: mode }),

    getLocOptions: () => Object.values(get().locTypes),

    upsertWagonType: (w) =>
        set((s) => ({
            wagonTypes: { ...s.wagonTypes, [w.id]: w },
        })),

    deleteWagonType: (id) =>
        set((s) => {
            const wt = { ...s.wagonTypes };
            delete wt[id];
            return {
                wagonTypes: wt,
                cars: s.cars.filter((c) => c.wagonTypeId !== id),
            };
        }),

    addCar: (wagonTypeId) =>
        set((s) => {
            // Default broms på (men r7 vill du typ alltid ha av)
            const brakeEnabled = wagonTypeId === "r7" ? false : true;

            // Default bromsläge EP (som du ville)
            const brakeMode: BrakeMode = "EP";

            // BR193 i transport: default vikt 90t via override
            const tareOverrideT = wagonTypeId === "br193" ? 90 : undefined;

            return {
                cars: [
                    ...s.cars,
                    {
                        id: crypto.randomUUID(),
                        wagonTypeId,
                        brakeEnabled,
                        brakeMode,
                        tareOverrideT,
                    },
                ],
            };
        }),

    removeCar: (wagonTypeId) =>
        set((s) => {
            const revIdx = [...s.cars].reverse().findIndex((c) => c.wagonTypeId === wagonTypeId);
            if (revIdx === -1) return s;
            const idx = s.cars.length - 1 - revIdx;
            const cars = [...s.cars];
            cars.splice(idx, 1);
            return { cars };
        }),

    removeCarById: (carId) =>
        set((s) => ({
            cars: s.cars.filter((c) => c.id !== carId),
        })),

    setCarBrakeMode: (carId, mode) =>
        set((s) => ({
            cars: s.cars.map((c) => (c.id === carId ? { ...c, brakeMode: mode } : c)),
        })),

    setCarBrakeEnabled: (carId, enabled) =>
        set((s) => ({
            cars: s.cars.map((c) => (c.id === carId ? { ...c, brakeEnabled: enabled } : c)),
        })),

    setCarTareOverride: (carId, tareT) =>
        set((s) => ({
            cars: s.cars.map((c) =>
                c.id === carId ? { ...c, tareOverrideT: tareT === null ? undefined : tareT } : c
            ),
        })),
}));

// ---- Beräkningar ----
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
                    ? w.brakeP
                    : car.brakeMode === "R"
                        ? w.brakeR
                        : (w.epBrake ?? 0);

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

        // för blankett/UI
        locBrakeSelected,
        locBrakeMode,
    };
}

export type Totals = ReturnType<typeof calcTotals>;

// ---- Plattform-hjälp ----
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
