precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 worldViewProjection;
uniform float time;
uniform float pole_x;

varying vec2 vUV;

void main(void) {
    vec3 v = position;

    float delta_y = sin(40. * position.x + time) * (position.x - pole_x) * .08;
    v.y += delta_y;

    float delta_z = - (position.x - pole_x) * 0.15 - sin(40. * position.x + time) * (position.x - pole_x) * .06 ;
    v.z += delta_z;

    gl_Position = worldViewProjection * vec4(v, 1.0);
    vUV = uv;
}
