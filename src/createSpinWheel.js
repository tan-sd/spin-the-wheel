const { createCanvas } = require('canvas');
const GIFEncoder = require("gifencoder");
const { createCanvasWheel } = require('./createWheel');

function generateSpinWheel(options, angle, duration, frameDelayMs, canvasWidth, canvasHeight, lastFrameDurationMS) {
    const encoder = new GIFEncoder(canvasWidth, canvasHeight);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(frameDelayMs);
    encoder.setQuality(10);
    encoder.setTransparent('#fff');

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const wheel = createCanvasWheel(canvas, ctx, options, angle, duration);

    for (let i = 0; i < duration; i++) {
        wheel.rotate(i);
        encoder.addFrame(ctx);
    }

    for (let i = 0; i < lastFrameDurationMS; i++) {
        encoder.addFrame(ctx);
    }

    encoder.finish();

    const selectedOption = wheel.getOptionByStep(duration);

    return {
        getGif: () => encoder.out.getData(),
        getLastFrame: () => canvas.toBuffer(),
        selectedOption: selectedOption.option,
        selectedOptionColor: selectedOption.color
    };
};

module.exports = { generateSpinWheel };