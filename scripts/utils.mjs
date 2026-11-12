export class Matcher {
    /**
     * The keys keyed by the lowercased names that match them exactly.
     * @type {Map<string, string>}
     */
    #keys = new Map();

    constructor(object) {
        for (const [key, matches] of Object.entries(object)) {
            const names = (Array.isArray(matches) ? matches : [matches])
                .map((m) => (Array.isArray(m) ? m : [m]).map((m) => Array.isArray(m) ? m : [m]))
                .flatMap((m) => m.reduce((a, b) => a.flatMap((c) => b.map((d) => c + d))));

            for (const name of new Set(names.map((name) => name.toLowerCase()))) {
                if (this.#keys.has(name)) {
                    throw new Error(`Duplicate name "${name}" for "${key}" and "${this.#keys.get(name)}"`);
                }

                this.#keys.set(name, key);
            }
        }
    }

    /**
     * Get the key whose names include the given string, ignoring case.
     * @param {string} string
     * @returns {string | undefined}
     */
    match(string) {
        return this.#keys.get(string.toLowerCase());
    }
}

/**
 * Convert a distance given in feet into the given units.
 * @param {number} range    The distance in feet.
 * @param {string} units    The target units.
 * @returns {number}
 */
export function fromFeet(range, units) {
    switch (units) {
        case "in": return range * 12;
        case "ft": return range;
        case "yd": return range / 3;
        case "mi": return range / 5280;
        case "mm": return range * 3000 / 10;
        case "cm": return range * 300 / 10;
        case "dm": return range * 30 / 10;
        case "m": return range * 3 / 10;
        case "km": return range * 3 / 10000;
        default: return range;
    }
}

/**
 * Convert a distance given in the given units into feet.
 * @param {number} range    The distance in the given units.
 * @param {string} units    The source units.
 * @returns {number}
 */
export function toFeet(range, units) {
    switch (units) {
        case "in": return range / 12;
        case "ft": return range;
        case "yd": return range * 3;
        case "mi": return range * 5280;
        case "mm": return range * 10 / 3000;
        case "cm": return range * 10 / 300;
        case "dm": return range * 10 / 30;
        case "m": return range * 10 / 3;
        case "km": return range * 10000 / 3;
        default: return range;
    }
}

/**
 * Convert a distance between two units.
 * @param {number} range        The distance.
 * @param {string} fromUnits    The source units.
 * @param {string} toUnits      The target units.
 * @returns {number}
 */
export function convertUnits(range, fromUnits, toUnits) {
    return fromFeet(toFeet(range, fromUnits), toUnits);
}
