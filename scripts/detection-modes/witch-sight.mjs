import DetectionMode from "./base.mjs";

const { Token } = foundry.canvas.placeables;

/**
 * The detection mode for Witch Sight.
 */
export default class DetectionModeWitchSight extends DetectionMode {
    constructor() {
        super({
            id: "witchSight",
            label: "VISION5E.WitchSight",
            type: DetectionMode.DETECTION_TYPES.OTHER,
            walls: false,
            angle: false,
            important: true,
            sort: 1,
        });
    }

    /** @override */
    static getDetectionFilter() {
        return this._detectionFilter ??= CONFIG.Canvas.detectionModes.detectEvilAndGood.constructor.getDetectionFilter();
    }

    /** @override */
    _canDetect(visionSource, target) {
        return !visionSource.object.document.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED)
            && target instanceof Token
            && target.document.hasStatusEffect(CONFIG.specialStatusEffects.SHAPECHANGER)
            && !target.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED);
    }

    /** @override */
    _testPoint(visionSource, mode, target, test) {
        if (!super._testPoint(visionSource, mode, target, test)) {
            return false;
        }

        // Test whether this vision source sees the target
        return this._testPreciseSight(visionSource, target, test);
    }
}
