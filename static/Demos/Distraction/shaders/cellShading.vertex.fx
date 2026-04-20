precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 world;
uniform mat4 worldViewProjection;

varying vec3 vPositionW;
varying vec3 vNormalW;

uniform mat4 lightMatrix;
varying vec4 vPositionFromLight;

void main(void) {
    
    vec4 positionW4 = world * vec4(position, 1.0);
    vPositionW = vec3(positionW4);
    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));

    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;

    vPositionFromLight = lightMatrix * positionW4;
}