import DetectionMode from "./base.mjs";

const { Token } = foundry.canvas.placeables;

/**
 * The detection mode for See Invisibility.
 */
export default class DetectionModeSeeInvisibility extends DetectionMode {
    constructor() {
        super({
            id: "seeInvisibility",
            label: "VISION5E.SeeInvisibility",
            type: DetectionMode.DETECTION_TYPES.OTHER,
            walls: false,
            angle: false,
        });
    }

    /** @override */
    static getDetectionFilter() {
        return this._detectionFilter ??= foundry.canvas.rendering.filters.GlowOverlayFilter.create({
            glowColor: [0, 0.60, 0.33, 1],
        });
    }

    /** @override */
    _canDetect(visionSource, target) {
        // Only invisible and ethereal tokens can be detected
        return !visionSource.object.document.hasStatusEffect(CONFIG.specialStatusEffects.DEFEATED)
            && target instanceof Token && (target.document.hasStatusEffect(CONFIG.specialStatusEffects.INVISIBLE)
                || target.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL));
    }

    /** @override */
    _testPoint(visionSource, mode, target, test) {
        if (!super._testPoint(visionSource, mode, target, test)) {
            return false;
        }

        // Test whether this vision source sees the target without the invisible and ethereal status effect
        return this._testPreciseSight(visionSource, target, test, [CONFIG.specialStatusEffects.INVISIBLE, CONFIG.specialStatusEffects.ETHEREAL]);
    }
}
