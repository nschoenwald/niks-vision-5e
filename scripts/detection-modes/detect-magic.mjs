import DetectionModeDetect from "./detect.mjs";

/**
 * The detection mode for Detect Magic.
 */
export default class DetectionModeDetectMagic extends DetectionModeDetect {
    constructor() {
        super({
            id: "detectMagic",
            label: "VISION5E.DetectMagic",
            imprecise: false,
        });
    }

    /** @override */
    static getDetectionFilter() {
        return this._detectionFilter ??= foundry.canvas.rendering.filters.GlowOverlayFilter.create({
            glowColor: [1, 0, 1, 1],
        });
    }

    /** @override */
    _canDetect(visionSource, target) {
        if (!super._canDetect(visionSource, target)) {
            return false;
        }

        return target.document.hasStatusEffect(CONFIG.specialStatusEffects.MAGICAL);
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
