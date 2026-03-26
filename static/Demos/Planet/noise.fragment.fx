// Noise function by https://github.com/holgerl/procedural-planet
precision highp float;

varying vec2 vPosition;
varying vec2 vUV;

uniform vec3 upperColor;
uniform vec3 middleColor;
uniform vec3 lowerColor;
uniform float face;
uniform sampler2D randomSampler;
uniform float mapSize;
uniform float maxResolution;
uniform float seed;
uniform vec2 lowerClamp;
uniform vec3 options;
uniform vec2 range;

float random5(vec2 co) {
	return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float random4(float x, float y, float z) {
	float rx = random5(vec2(x, y));
	float ry = random5(vec2(y, z));

	return texture2D(randomSampler, vec2(rx, ry)).g;
}

float random4(int x, int y, int z) {
	return random4(float(x), float(y), float(z));
}

float interpolation(float a, float b, float x) {
	float ft = x * 3.1415927;
	float f = (1.0 - cos(ft)) * 0.5;
	return a*(1.0 - f) + b*f;
}

float tricosine(vec3 coordFloat) {
	vec3 coord0 = vec3(floor(coordFloat.x), floor(coordFloat.y), floor(coordFloat.z));
	vec3 coord1 = vec3(coord0.x + 1.0, coord0.y + 1.0, coord0.z + 1.0);
	float xd = (coordFloat.x - coord0.x) / max(1.0, (coord1.x - coord0.x));
	float yd = (coordFloat.y - coord0.y) / max(1.0, (coord1.y - coord0.y));
	float zd = (coordFloat.z - coord0.z) / max(1.0, (coord1.z - coord0.z));
	float c00 = interpolation(random4(coord0.x, coord0.y, coord0.z), random4(coord1.x, coord0.y, coord0.z), xd);
	float c10 = interpolation(random4(coord0.x, coord1.y, coord0.z), random4(coord1.x, coord1.y, coord0.z), xd);
	float c01 = interpolation(random4(coord0.x, coord0.y, coord1.z), random4(coord1.x, coord0.y, coord1.z), xd);
	float c11 = interpolation(random4(coord0.x, coord1.y, coord1.z), random4(coord1.x, coord1.y, coord1.z), xd);
	float c0 = interpolation(c00, c10, yd);
	float c1 = interpolation(c01, c11, yd);
	float c = interpolation(c0, c1, zd);

	return c;
}

float nearestNeighbour(vec3 coordFloat) {
	return random4(int(floor(coordFloat.x)), int(floor(coordFloat.y)), int(floor(coordFloat.z)));
}

float helper(float x, float y, float z, float resolution) {
	x = (x + 1.0) / 2.0*resolution;
	y = (y + 1.0) / 2.0*resolution;
	z = (z + 1.0) / 2.0*resolution;

	vec3 coordFloat = vec3(x, y, z);
	float interpolated = tricosine(coordFloat);
	return interpolated*2.0 - 1.0;
}

float scalarField(float x, float y, float z) {
	float resolutionMax = maxResolution;
	float resolution5 = resolutionMax / 2.0;
	float resolution4 = resolutionMax / 4.0;
	float resolution3 = resolutionMax / 8.0;
	float resolution2 = resolutionMax / 16.0;
	float resolution1 = resolutionMax / 32.0;

	vec3 coordFloat = vec3(0.0, 0.0, 0.0);

	float level1 = helper(x, y, z, resolution1);
	float level2 = helper(x, y, z, resolution2);
	float level3 = helper(x, y, z, resolution3);
	float level4 = helper(x, y, z, resolution4);
	float level5 = helper(x, y, z, resolution5);
	float levelMax = helper(x, y, z, resolutionMax);

	float c = seed;
	c *= 1.0 + level1 * 0.8;
	c *= 1.0 + level2 * 0.4;
	c *= 1.0 + level3 * 0.2;
	c *= 1.0 + level4 * 0.1;
	c *= 1.0 + level5 * 0.05;
	c *= 1.0 + levelMax * 0.025;

	if (c < options.y)
	{
		c *= options.z;
	}

	return clamp(c, 0.0, 1.0);
}

vec3 getSphericalCoord(float face, float x, float y, float width) {
	width /= 2.0;
	x -= width;
	y -= width;
	vec3 coord = vec3(0.0, 0.0, 0.0);

	if (face == 0.0) { coord.x = width; coord.y = -y; coord.z = -x; }
	else if (face == 1.0) { coord.x = -width; coord.y = -y; coord.z = x; }
	else if (face == 2.0) { coord.x = x; coord.y = width; coord.z = y; }
	else if (face == 3.0) { coord.x = x; coord.y = -width; coord.z = -y; }
	else if (face == 4.0) { coord.x = x; coord.y = -y; coord.z = width; }
	else { coord.x = -x; coord.y = -y; coord.z = -width; }

	return normalize(coord);
}

void main() {
	float x = vUV.x;
	float y = vUV.y;
	vec3 sphericalCoord = getSphericalCoord(face, x * mapSize, y * mapSize, mapSize);

	float luminance = scalarField(sphericalCoord.x, sphericalCoord.y, sphericalCoord.z);

	if (options.x > 0.)
	{
		gl_FragColor = vec4(luminance, luminance, luminance, 1.0);
	}
	else
	{
		if (luminance < range.x)
		{
			float scale0 = luminance / range.x;
			gl_FragColor = vec4(lowerColor, 1.0) * clamp(scale0, lowerClamp.x, lowerClamp.y);
		}
		else if (luminance < range.y)
		{
			float scaleLeft1 = (luminance - range.x) / (range.y - range.x);
			float scaleRight1 = (luminance - range.x) / (1.0 - range.x);
			gl_FragColor = vec4(lowerColor, 1.0) * (1.0 - scaleLeft1) + vec4(upperColor, 1.0) * scaleRight1;
		}
		else
		{
			float scale2 = (luminance - range.x) / (1.0 - range.x);
			gl_FragColor = vec4(upperColor, 1.0) * scale2;
		}
	}
}