#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUV;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

// Refs
uniform sampler2D textureSampler;

void main(void) {
	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fogFactor = smoothstep(fogNear, fogFar, depth);

	gl_FragColor = texture2D(textureSampler, vUV);
	gl_FragColor.w *= pow(abs(gl_FragCoord.z), 20.0);
	gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}