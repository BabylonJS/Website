precision highp float;

// Varying
varying vec2 vUV;

// Refs
uniform sampler2D textureSampler;

void main(void) {
    vec3 color = texture2D(textureSampler, vUV).rgb;
    gl_FragColor = vec4(color, 1.);
}
