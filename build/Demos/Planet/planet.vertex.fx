precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;
uniform mat4 rotation;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vNormal;
varying vec3 vNormalR;

void main(void) {
	vec4 outPosition = worldViewProjection * vec4(position, 1.0);
	gl_Position = outPosition;

	vPositionW = vec3(world * vec4(position, 1.0));
	vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
	vNormal = normal;
	vNormalR = vec3(rotation * vec4(normal, 0.0));
}