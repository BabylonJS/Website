precision highp float;

// Position & normal
varying vec3 vPositionW;
varying vec3 vNormalW;
//varying vec2 vUV;

// Light0
uniform vec3 light0Pos;

// Refs
uniform vec3 diffuseColor;
//uniform sampler2D textureSampler;
uniform sampler2D shadowSampler;
varying vec4 vPositionFromLight;

uniform mat4 lightMatrix;


float unpack(vec4 color)
{
    const vec4 bit_shift = vec4(1.0 / (255.0 * 255.0 * 255.0), 1.0 / (255.0 * 255.0), 1.0 / 255.0, 1.0);
    return dot(color, bit_shift);
}

float unpackHalf(vec2 color)
{
    return color.x + (color.y / 255.0);
}

float computeShadow(vec4 vPositionFromLight, sampler2D shadowSampler, float darkness)
{
	vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;
    depth = 0.5 * depth + vec3(0.5);
    vec2 uv = depth.xy;
    if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0)
    {
        return 1.0;
    }
    float shadow = unpack(texture2D(shadowSampler, uv)) /*+ bias*/;
    if (depth.z > shadow)
    {
        return darkness;
    }
    return 1.;
}

float computeShadowWithPCF(vec4 vPositionFromLight, sampler2D shadowSampler, float mapSize, float bias)
{
    vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;
    depth = 0.5 * depth + vec3(0.5);
    vec2 uv = depth.xy;

    if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0)
    {
        return 1.0;
    }

    float visibility = 1.;
    vec2 poissonDisk[4];
    poissonDisk[0] = vec2(-0.94201624, -0.39906216);
    poissonDisk[1] = vec2(0.94558609, -0.76890725);
    poissonDisk[2] = vec2(-0.094184101, -0.92938870);
    poissonDisk[3] = vec2(0.34495938, 0.29387760);

    // Poisson Sampling
    float biasedDepth = depth.z - bias;
    if (unpack(texture2D(shadowSampler, uv + poissonDisk[0] / mapSize)) < biasedDepth) visibility -= 0.25;
    if (unpack(texture2D(shadowSampler, uv + poissonDisk[1] / mapSize)) < biasedDepth) visibility -= 0.25;
    if (unpack(texture2D(shadowSampler, uv + poissonDisk[2] / mapSize)) < biasedDepth) visibility -= 0.25;
    if (unpack(texture2D(shadowSampler, uv + poissonDisk[3] / mapSize)) < biasedDepth) visibility -= 0.25;
    return visibility;
}

float linstep(float low, float high, float v) {
    return clamp((v - low) / (high - low), 0.0, 1.0);
}

float ChebychevInequality(vec2 moments, float compare, float bias)
{
    float p = smoothstep(compare - bias, compare, moments.x);
    float variance = max(moments.y - moments.x * moments.x, 0.02);
    float d = compare - moments.x;
    float p_max = linstep(0.2, 1.0, variance / (variance + d * d));

    return clamp(max(p, p_max), 0.0, 1.0);
}

float computeShadowWithVSM(vec4 vPositionFromLight, sampler2D shadowSampler, float bias)
{
vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;
	depth = 0.5 * depth + vec3(0.5);
	vec2 uv = depth.xy;

	if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0 || depth.z >= 1.0)
	{
		return 1.0;
	}

	vec4 texel = texture2D(shadowSampler, uv);

	vec2 moments = vec2(unpackHalf(texel.xy), unpackHalf(texel.zw));
	return 1.0 - ChebychevInequality(moments, depth.z, bias);
}

void Thresholds(in vec3 diffuseColor, out vec3 pixelColor, out float ndl) {

    float ToonThresholds[8];
    ToonThresholds[0] = 0.9;
    ToonThresholds[1] = 0.7;
    ToonThresholds[2] = 0.5;
    ToonThresholds[3] = 0.0; 
    ToonThresholds[4] = -0.1;
    ToonThresholds[5] = -0.3;
    ToonThresholds[6] = -0.5;
    ToonThresholds[7] = -0.7;

    float ToonBrightnessLevels[9];
    ToonBrightnessLevels[0] = .95;  // light
    ToonBrightnessLevels[1] = .90;
    ToonBrightnessLevels[2] = .85;
    ToonBrightnessLevels[3] = .80;
    ToonBrightnessLevels[4] = .55;  // dark
    ToonBrightnessLevels[5] = .45;
    ToonBrightnessLevels[6] = .35;
    ToonBrightnessLevels[7] = .30;
    ToonBrightnessLevels[8] = .25;

    // Light
    vec3 lightVectorW = normalize(light0Pos * 100.0 - vPositionW);

    // diffuse
    ndl = dot(vNormalW, lightVectorW);

    //vec3 color = texture2D(textureSampler, vUV).rgb;
    pixelColor = diffuseColor;

    if (ndl > ToonThresholds[0])
    {
        pixelColor *= ToonBrightnessLevels[0];
    }
    else if (ndl > ToonThresholds[1])
    {
        pixelColor *= ToonBrightnessLevels[1];
    }
    else if (ndl > ToonThresholds[2])
    {
        pixelColor *= ToonBrightnessLevels[2];
    }
    else if (ndl > ToonThresholds[3])
    {
        pixelColor *= ToonBrightnessLevels[3];
    }
    else if (ndl > ToonThresholds[4])
    {
        pixelColor *= ToonBrightnessLevels[4];
    }
    else if (ndl > ToonThresholds[5])
    {
        pixelColor *= ToonBrightnessLevels[5];
    }
    else if (ndl > ToonThresholds[6])
    {
        pixelColor *= ToonBrightnessLevels[6];
    }
    else if (ndl > ToonThresholds[7])
    {
        pixelColor *= ToonBrightnessLevels[7];
    }
    else
    {
        pixelColor *= ToonBrightnessLevels[8];
    }
}

void main(void)
{
    vec3 pixelColor;
    float ndl;
    Thresholds(diffuseColor, pixelColor, ndl);

    //float shadow = computeShadow(vPositionFromLight, shadowSampler, 0.7);
    //float shadow = computeShadowWithVSM(vPositionFromLight, shadowSampler, 0.);
    float shadow = computeShadowWithPCF(vPositionFromLight, shadowSampler, 8192., 0.00002);
    shadow = min(1., 0.8 + shadow * 0.2);
    
    vec3 lightVectorW = normalize(light0Pos * 100.0 - vPositionW);
    float dp = dot(vNormalW, lightVectorW);

    gl_FragColor =  vec4(pixelColor, 1.);
    if(dp > 0.0) gl_FragColor *= shadow;
}