precision highp float;

// The input texture: the rendered scene
varying vec2 vUV;
uniform sampler2D textureSampler;

void main(void) {
    vec4 color = texture2D(textureSampler, vUV);
    float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11));
    gl_FragColor = vec4(vec3(gray), color.a);
}
