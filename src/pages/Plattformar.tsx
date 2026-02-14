type Track = { name: string; lengthM: number; note?: string };
type Location = { name: string; tracks: Track[] };

const LOCATIONS: Location[] = [
    {
        name: "Malmö C",
        tracks: [
            { name: "Spår 5", lengthM: 427 },
            { name: "Spår 6", lengthM: 283 },
            { name: "Spår 7", lengthM: 283 },
            { name: "Spår 8", lengthM: 281 },
            { name: "Spår 9", lengthM: 281 },
        ],
    },
    {
        name: "Lund C",
        tracks: [
            { name: "Spår 1", lengthM: 357 },
            { name: "Spår 2", lengthM: 390 },
            { name: "Spår 3", lengthM: 390 },
            { name: "Spår 4", lengthM: 380 },
            { name: "Spår 5", lengthM: 380 },
            { name: "Spår 6", lengthM: 374 },
        ],
    },
    {
        name: "Eslöv",
        tracks: [
            { name: "Spår 3", lengthM: 277 },
            { name: "Spår 4", lengthM: 277 },
            { name: "Spår 5", lengthM: 251 },

        ],
    },
    {
        name: "Hässleholm",
        tracks: [
            { name: "Spår 3a", lengthM: 286, note: "2,3a 286m styck. längre tåg spår 3 via spår 2" },
            { name: "Spår 4", lengthM: 277 },
            { name: "Spår 5", lengthM: 251 },
            { name: "Spår 3", lengthM: 277 },
            { name: "Spår 4", lengthM: 277 },
            { name: "Spår 5", lengthM: 251 },

        ],
    },
    {
        name: "Alvesta",
        tracks: [
            { name: "Spår 1a", lengthM: 139 },
            { name: "Spår 1a,2", lengthM: 414, note: "känns bs" },
            { name: "Spår 3a,3b", lengthM: 610 },
            { name: "Spår 4a,4b", lengthM: 610 },


        ],
    },
    {
        name: "Nässjö",
        tracks: [
            { name: "Spår 2n,2s,3n,4n,4s", lengthM: 499 },
            { name: "Spår 5n,6s,7n,8s", lengthM: 478 },
            { name: "Spår 9n,10n", lengthM: 310 },



        ],
    },
    {
        name: "Linköping",
        tracks: [
            { name: "Spår 1", lengthM: 371 },
            { name: "Spår 2", lengthM: 376 },
            { name: "Spår 3", lengthM: 376 },



        ],
    },

];

export default function Plattformar() {
    return (
        <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ margin: "6px 0 14px" }}>Plattformar</h1>

            <div style={{ display: "grid", gap: 14 }}>
                {LOCATIONS.map((loc) => (
                    <section
                        key={loc.name}
                        style={{
                            border: "1px solid #e5e5e5",
                            borderRadius: 14,
                            padding: 14,
                            background: "var(--card)",
                        }}
                    >
                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
                            {loc.name}
                        </div>

                        <div style={{ display: "grid", gap: 6 }}>
                            {loc.tracks.map((t) => (
                                <div
                                    key={t.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        justifyContent: "space-between",
                                        gap: 12,
                                        padding: "6px 8px",
                                        borderRadius: 10,
                                        background: "var(--card)",
                                        border: "1px solid #fff"
                                    }}
                                >
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: 650 }}>{t.name}</span>
                                        {t.note ? (
                                            <span style={{ opacity: 0.7, fontSize: 13 }}>
                                                {t.note}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 650 }}>
                                        {t.lengthM} m
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
