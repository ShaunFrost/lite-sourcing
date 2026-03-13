export const ALLOWED_CATEGORIES = [
    "Plumbing",
    "HVAC",
    "Electrical",
    "Finishing",
    "Structural Steel",
    "Safety"
]

export const ALLOWED_UNITS = [
    "piece",
    "meter",
    "ton",
    "sqm",
    "bucket"
] as const

export type MeasuringUnit = typeof ALLOWED_UNITS[number]

export const SIMILAR_UNIT_MAPS = {
    "piece" : ["piece", "pieces", "pc", "pcs"],
    "meter" : ["meter", "m", "meters", "ms"],
    "ton" : ["ton", "tons", "tonne", "tonnes"],
    "sqm" : ["sqm", "sqms", "msq"],
    "bucket" : ["bucket", "buckets"]
}
