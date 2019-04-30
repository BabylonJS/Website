#ifdef GL_ES
precision mediump float;
#endif

// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

// Normal
varying vec2 vUV;

void main(void) {
	gl_Position = worldViewProjection * vec4(position, 1.0);

	vUV = uv;
}