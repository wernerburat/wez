// VERTEX SHADERS
export const BASIC_PASS_VERTEX_SHADER = /* glsl */ `
precision highp float;

// Attributes
attribute vec2 position;

// Output
varying vec2 vUV;

void main(void) {
    gl_Position = vec4(position, 0.0, 1.0);
    vUV = position * 0.5 + 0.5;
}
`;

// FRAGMENT SHADERS
export const RED_FILTER_FRAGMENT_SHADER = `
// RED!!!!
precision highp float;

// Input
varying vec2 vUV;
uniform sampler2D textureSampler;

void main(void) {
    vec4 color = texture2D(textureSampler, vUV);
    gl_FragColor = vec4(1.0, color.g * 0.5, color.b * 0.5, color.a);  // Red tint
    //gl_FragColor = vec4(color.r, color.g, color.b, color.a);  // Normal
}
`;

export const NO_FILTER_FRAGMENT_SHADER = `
// NO FILTER!!!
precision highp float;

// Input
varying vec2 vUV;
uniform sampler2D textureSampler;

void main(void) {
    vec4 color = texture2D(textureSampler, vUV);
    //gl_FragColor = vec4(1.0, color.g * 0.5, color.b * 0.5, color.a);  // Red tint
    gl_FragColor = vec4(color.r, color.g, color.b, color.a);  // Normal
}
`;

export const DITHERING_FRAGMENT_SHADER = `
// DITHERING!!!
precision highp float;

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float ditherScale;

// 4x4 Bayer matrix normalized to range [0, 1]
const mat4 bayerMatrix = mat4(
    0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0,
    12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0,
    3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0,
    15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0
);

void main() {
    vec4 color = texture2D(textureSampler, vUV);

    // Convert to grayscale
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    // Find position in dither matrix
    vec2 ditherPos = mod(ditherScale * vUV, 4.0);
    float ditherValue = bayerMatrix[int(ditherPos.x)][int(ditherPos.y)];

    // Apply dithering
    color.rgb = step(ditherValue, gray) * vec3(1.0);

    gl_FragColor = color;
}

`;
