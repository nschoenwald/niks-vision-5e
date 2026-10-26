import { DETECTION_LEVELS } from "./const.mjs";

const { Token } = foundry.canvas.placeables;

export default (CanvasVisibility) => class extends CanvasVisibility {
    /** @override */
    testVisibility(points, options = {}) {
        const object = options.object ?? null;

        // The patched Token#_refreshVisibility resets Token#_detectionLevel to undefined, and only then
        // the detection level and filter of the token are assigned here
        const assignDetection = object instanceof Token && object._detectionLevel === undefined;

        if (!canvas.effects.visionSources.some((source) => source.active)) {
            const visible = game.user.isGM;

            if (assignDetection) {
                object._detectionLevel = visible ? DETECTION_LEVELS.PRECISE : DETECTION_LEVELS.NONE;
                object._detectionFilter = null;
            }

            return visible;
        }

        if (game.release.generation >= 14 && !Array.isArray(points)) {
            points = [points];
        }

        const config = this._createVisibilityTestConfig(points, options);

        for (const lightSource of canvas.effects.lightSources) {
            if (!lightSource.data.vision || !lightSource.active) {
                continue;
            }

            if (lightSource.testVisibility(config) === true) {
                if (assignDetection) {
                    object._detectionLevel = DETECTION_LEVELS.PRECISE;
                    object._detectionFilter = null;
                }

                return true;
            }
        }

        const sceneRect = canvas.dimensions.sceneRect;
        let inBuffer;

        if (game.release.generation >= 14) {
            inBuffer = points.every((point) => !sceneRect.contains(point.x, point.y));
        } else {
            inBuffer = !sceneRect.contains(points.x, points.y);
        }

        /** @type {DetectionTest[] | null} */
        let tests = null;
        let merged = false;

        for (const visionSource of canvas.effects.visionSources) {
            if (!visionSource.active || inBuffer === sceneRect.contains(visionSource.x, visionSource.y)) {
                continue;
            }

            const sourceTests = getDetectionTests(visionSource);

            if (sourceTests.length === 0) {
                continue;
            }

            if (tests === null) {
                // The tests of a single vision source are already sorted and can be used as is
                tests = sourceTests;
            } else {
                if (!merged) {
                    tests = tests.slice();
                    merged = true;
                }

                for (let i = 0, n = sourceTests.length; i < n; i++) {
                    tests.push(sourceTests[i]);
                }
            }
        }

        if (tests === null) {
            if (assignDetection) {
                object._detectionLevel = DETECTION_LEVELS.NONE;
                object._detectionFilter = null;
            }

            return false;
        }

        if (merged) {
            tests.sort(compareDetectionTests);
        }

        /** @type {Set<PIXI.Filter> | null} */
        let detectionFilters = null;
        let visible = false;
        let detectionLevel = DETECTION_LEVELS.NONE;

        for (let i = 0, n = tests.length; i < n; i++) {
            const { detectionMode, visionSource, mode } = tests[i];

            if (detectionMode.testVisibility(visionSource, mode, config) !== true) {
                continue;
            }

            visible = true;
            detectionLevel = Math.max(detectionLevel, detectionMode.imprecise ? DETECTION_LEVELS.IMPRECISE : DETECTION_LEVELS.PRECISE);

            if (assignDetection) {
                const detectionFilter = detectionMode.constructor.getDetectionFilter(visionSource, config);

                if (detectionFilter) {
                    (detectionFilters ??= new Set()).add(detectionFilter);
                }
            }

            if (!detectionMode.important) {
                break;
            }
        }

        if (assignDetection) {
            object._detectionLevel = visible ? detectionLevel : DETECTION_LEVELS.NONE;

            if (!visible || !detectionFilters) {
                object._detectionFilter = null;
            } else if (detectionFilters.size > 1) {
                object._detectionFilter = getMultiDetectionFilter([...detectionFilters].reverse());
            } else {
                object._detectionFilter = detectionFilters.first();
            }
        }

        return visible;
    }
};

/**
 * @typedef {object} DetectionTest
 * @property {foundry.canvas.perception.DetectionMode} detectionMode
 * @property {foundry.canvas.sources.PointVisionSource} visionSource
 * @property {{ range: number; enabled: boolean }} mode
 * @property {number} rank    Important first, then precise, then the token's primary detection mode.
 * @property {number} sort
 */

/**
 * The sorted detection tests of vision sources keyed by the detection modes of the source's token.
 * @type {WeakMap<object, { visionSource: foundry.canvas.sources.PointVisionSource; primary: string; tests: DetectionTest[] }>}
 */
const DETECTION_TESTS = new WeakMap();

/**
 * Invalidate the cached detection tests of the given detection modes.
 * Must be called whenever the detection modes are modified in place.
 * @param {object} detectionModes
 */
export function invalidateDetectionTests(detectionModes) {
    DETECTION_TESTS.delete(detectionModes);
}

/**
 * @param {DetectionTest} test1
 * @param {DetectionTest} test2
 * @returns {number}
 */
function compareDetectionTests(test1, test2) {
    return test1.rank - test2.rank || test1.sort - test2.sort;
}

/**
 * Get the sorted detection tests of the vision source.
 * @param {foundry.canvas.sources.PointVisionSource} visionSource
 * @returns {DetectionTest[]}
 */
function getDetectionTests(visionSource) {
    const document = visionSource.object.document;
    const detectionModes = document.detectionModes;
    const primary = document.sight.detectionMode;
    const cached = DETECTION_TESTS.get(detectionModes);

    if (cached && cached.visionSource === visionSource && cached.primary === primary) {
        return cached.tests;
    }

    const tests = [];

    for (const [id, mode] of document._getDetectionModes()) {
        const detectionMode = CONFIG.Canvas.detectionModes[id];

        if (!detectionMode) {
            continue;
        }

        tests.push({
            detectionMode,
            visionSource,
            mode,
            rank: (detectionMode.important ? 0 : 4) + (detectionMode.imprecise ? 2 : 0) + (detectionMode.id === primary ? 0 : 1),
            sort: detectionMode.sort ?? 0,
        });
    }

    tests.sort(compareDetectionTests);
    DETECTION_TESTS.set(detectionModes, { visionSource, primary, tests });

    return tests;
}

/** @type {WeakMap<PIXI.Filter, number>} */
const FILTER_IDS = new WeakMap();

/** @type {number} */
let nextFilterId = 0;

/** @type {Map<string, MultiDetectionFilter>} */
const MULTI_DETECTION_FILTERS = new Map();

/**
 * Get the shared filter that applies all the given filters in order.
 * @param {PIXI.Filter[]} filters
 * @returns {MultiDetectionFilter}
 */
function getMultiDetectionFilter(filters) {
    let key = "";

    for (const filter of filters) {
        let id = FILTER_IDS.get(filter);

        if (id === undefined) {
            FILTER_IDS.set(filter, id = nextFilterId++);
        }

        key += `${id},`;
    }

    let multiFilter = MULTI_DETECTION_FILTERS.get(key);

    if (!multiFilter) {
        if (MULTI_DETECTION_FILTERS.size >= 64) {
            MULTI_DETECTION_FILTERS.clear();
        }

        multiFilter = new MultiDetectionFilter(filters);
        MULTI_DETECTION_FILTERS.set(key, multiFilter);
    }

    return multiFilter;
}

class MultiDetectionFilter extends PIXI.Filter {
    /** @type {PIXI.Filter[]} */
    filters;

    constructor(filters) {
        super();

        this.filters = filters;
    }

    /** @override */
    get enabled() {
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (filter.enabled) {
                return true;
            }
        }

        return false;
    }

    set enabled(value) { }

    /** @override */
    get autoFit() {
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (!filter.enabled) {
                continue;
            }

            if (!filter.autoFit) {
                return false;
            }
        }

        return true;
    }

    set autoFit(value) { }

    /** @override */
    get padding() {
        let padding = 0;
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (!filter.enabled) {
                continue;
            }

            padding = Math.max(padding, filter.padding);
        }

        return padding;
    }

    set padding(value) { }

    /** @override */
    get resolution() {
        let resolution = null;
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (!filter.enabled) {
                continue;
            }

            if (!filter.resolution) {
                return null;
            }

            resolution = Math.max(resolution, filter.resolution);
        }

        return resolution;
    }

    set resolution(value) { }

    /** @override */
    get multisample() {
        let multisample = PIXI.MSAA_QUALITY.NONE;
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (!filter.enabled) {
                continue;
            }

            if (filter.multisample === null) {
                return null;
            }

            multisample = Math.max(multisample, filter.multisample);
        }

        return multisample;
    }

    set multisample(value) { }

    /** @override */
    get legacy() {
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (!filter.enabled) {
                continue;
            }

            if (filter.legacy ?? true) {
                return true;
            }
        }

        return false;
    }

    set legacy(value) { }

    /** @override */
    apply(filterManager, input, output, clearMode, currentState) {
        const filters = this.filters;

        for (let i = 0, n = filters.length; i < n; i++) {
            const filter = filters[i];

            if (!filter.enabled) {
                continue;
            }

            filter.apply(filterManager, input, output, clearMode, currentState);
            clearMode = PIXI.CLEAR_MODES.BLEND;
        }
    }
}
