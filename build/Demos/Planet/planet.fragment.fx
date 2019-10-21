precision highp float;

// Vertex
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vNormal;
varying vec3 vNormalR;

// Refs
uniform vec3 cameraPosition;
uniform samplerCube textureSampler;
uniform samplerCube cloudSampler;
uniform vec3 options;
uniform vec3 haloColor;
uniform vec3 lightPosition;

float computeFresnelTerm(vec3 viewDirection, vec3 worldNormal, float bias, float power)
{
	float fresnelTerm = pow(bias + abs(dot(viewDirection, worldNormal)), power);
	return clamp(fresnelTerm, 0., 1.);
}

void main(void) {
	vec3 color = textureCube(textureSampler, vNormal).rgb * options.y;
	vec3 cloud = textureCube(cloudSampler, vNormalR).rgb * options.z;

	// Light
	vec3 direction = lightPosition - vPositionW;
	vec3 lightVectorW = normalize(direction);

	// diffuse
	float ndl = max(0., dot(vNormalW, lightVectorW)) + 0.05;

	ndl = min(asin(ndl), 1.0);

	// Fresnel
	vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
	float fresnelTerm = computeFresnelTerm(viewDirectionW, vNormalW, 0.65, 16.);

	// Emissive
	vec3 emissiveColor = haloColor * (1.0 - fresnelTerm) *clamp(1.0 - ndl, 0.2, 1.0);

	// Cloud
	float cloudLuminance = 0.;

	if (options.x != 0.0)
	{
		cloudLuminance = dot(cloud, vec3(0.3, 0.59, 0.11));
	}

	// Combine
	if (cloudLuminance < 0.5)
	{
		gl_FragColor = vec4(color * ndl * fresnelTerm + emissiveColor, fresnelTerm);
	}
	else
	{
		cloudLuminance = (cloudLuminance - 0.5) / 0.5;
		gl_FragColor = vec4((cloud * cloudLuminance + color) * ndl * fresnelTerm + emissiveColor, fresnelTerm);
	}
}