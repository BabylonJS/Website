#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUV;

uniform sampler2D tunnelSampler;
uniform float time;

void main(void)
{
	vec2 position = -1.0 + 2.0 * vUV;
	vec2 uv;

	float r = sqrt(dot(position, position));

	float a = atan(position.y, position.x) + 0.9*sin(0.5*r - 0.5*time);

	float h = (0.5 + 0.5*sin(9.0*a));

	float s = smoothstep(0.4, 0.5, h);

	uv.x = time + 1.0 / (r + .1*s);
	uv.y = 3.0*a / 3.1416;

	vec3 col = texture2D(tunnelSampler, uv).xyz;

	float ao = smoothstep(0.0, 0.3, h) - smoothstep(0.5, 1.0, h);
	col *= 1.0 - 0.6*ao*r;
	col *= r*r;

	gl_FragColor = vec4(col, 1.0);
}
