import { DETECTION_LEVELS } from "../const.mjs";

/**
 * The vision sources collection used while testing visibility for a single vision source.
 * @type {foundry.utils.Collection<string, foundry.canvas.sources.PointVisionSource>}
 */
const SINGLE_VISION_SOURCE = new foundry.utils.Collection();

export default class extends foundry.canvas.perception.DetectionMode {
    /** @override */
    static defineSchema() {
        return Object.assign(
            super.defineSchema(),
            {
                imprecise: new foundry.data.fields.BooleanField(),
                important: new foundry.data.fields.BooleanField(),
                sort: new foundry.data.fields.NumberField({ required: true, nullable: false, initial: 0 }),
            },
        );
    }

    static {
        Hooks.once("init", () => {
            if (game.release.generation >= 14) {
                return;
            }

            const { PointSourcePolygon } = foundry.canvas.geometry;

            /**
             * @overload
             * @param {foundry.canvas.sources.PointVisionSource} visionSource
             * @param {Omit<foundry.types.CanvasVisibilityTest, "los">} test
             * @param {Partial<Omit<foundry.canvas.geometry.types.PointSourcePolygonConfig, "source">>} [config]
             * @returns {boolean}
             * @internal
             */
            /**
             * @overload
             * @param {foundry.canvas.sources.PointVisionSource} visionSource
             * @param {Pick<foundry.types.CanvasVisibilityTest, "point"|"los">} test
             * @param {foundry.canvas.geometry.PointSourcePolygon} los
             * @returns {boolean}
             * @internal
             */
            this._testCollision = function (visionSource, test, config) {
                const origin = visionSource.origin;
                const destination = test.point;
                let los;

                if (config instanceof PointSourcePolygon) {
                    los = config;
                    config = los.config;
                }

                if (los) {
                    return los.contains(destination.x, destination.y);
                }

                const { angle = 360, rotation = 0, externalRadius = 0 } = config;

                if (angle < 360 || externalRadius > 0) {
                    const dx = destination.x - origin.x;
                    const dy = destination.y - origin.y;

                    if (dx * dx + dy * dy <= externalRadius * externalRadius) {
                        if (angle <= 0) {
                            return true;
                        }

                        const aMin = rotation + 90 - (angle / 2);
                        const a = Math.toDegrees(Math.atan2(dy, dx));

                        if (((a - aMin) % 360 + 360) % 360 > angle) {
                            return true;
                        }
                    }
                }

                const type = config.type ?? visionSource.constructor.sourceType;

                config = { priority: visionSource.priority, ...config, type, mode: "any", source: visionSource };

                return CONFIG.Canvas.polygonBackends[type].testCollision(origin, destination, config);
            };
        });
    }

    /**
     * Test whether the vision source detects the target with any of its precise sight detection modes.
     * The vision source's detection modes, the canvas vision sources, and the target's statuses
     * are restored afterwards even if the test throws.
     * @param {foundry.canvas.sources.PointVisionSource} visionSource
     * @param {foundry.canvas.placeables.Token} target
     * @param {foundry.types.CanvasVisibilityTest} test
     * @param {string[]} [ignoredStatuses]    Statuses of the target that are ignored during the test.
     * @returns {boolean}
     * @protected
     */
    _testPreciseSight(visionSource, target, test, ignoredStatuses = []) {
        const effects = canvas.effects;
        const visionSources = effects.visionSources;
        const document = visionSource.object.document;
        const detectionModes = document.detectionModes;
        const detectionLevel = target._detectionLevel;
        const statuses = target.document.actor?.statuses;
        const removedStatuses = [];

        try {
            SINGLE_VISION_SOURCE.clear();
            SINGLE_VISION_SOURCE.set(visionSource.sourceId, visionSource);
            effects.visionSources = SINGLE_VISION_SOURCE;

            // Prevent the nested test from assigning the detection level and filter of the target
            target._detectionLevel = DETECTION_LEVELS.NONE;

            document._filterDetectionModes((id) => {
                const mode = CONFIG.Canvas.detectionModes[id];

                return mode && mode !== this && mode.type === this.constructor.DETECTION_TYPES.SIGHT && !mode.imprecise;
            });

            for (const statusId of ignoredStatuses) {
                if (statuses?.delete(statusId)) {
                    removedStatuses.push(statusId);
                }
            }

            return canvas.visibility.testVisibility(test.point, { tolerance: 0, object: target });
        } finally {
            for (const statusId of removedStatuses) {
                statuses.add(statusId);
            }

            target._detectionLevel = detectionLevel;
            document.detectionModes = detectionModes;
            effects.visionSources = visionSources;
            SINGLE_VISION_SOURCE.clear();
        }
    }
}
