uniform float uOpacity;

varying float vTemperature;
varying float vTwinkle;
varying float vRadius;

vec3 kelvinToRgb(float kelvin) {
	float t = clamp(kelvin, 1000.0, 40000.0) / 100.0;
	float r;
	float g;
	float b;

	if (t <= 66.0) {
		r = 1.0;
		g = clamp((99.4708025861 * log(t) - 161.1195681661) / 255.0, 0.0, 1.0);
		if (t <= 19.0) {
			b = 0.0;
		} else {
			b = clamp((138.5177312231 * log(t - 10.0) - 305.0447927307) / 255.0, 0.0, 1.0);
		}
	} else {
		r = clamp((329.698727446 * pow(t - 60.0, -0.1332047592)) / 255.0, 0.0, 1.0);
		g = clamp((288.1221695283 * pow(t - 60.0, -0.0755148492)) / 255.0, 0.0, 1.0);
		b = 1.0;
	}

	return vec3(r, g, b);
}

void main() {
	vec2 uv = gl_PointCoord - vec2(0.5);
	float dist = length(uv);

	if (dist > 0.5) discard; // Discard fragments outside the circle

	float core = exp(-36.0 * dist * dist);
	float disc = smoothstep(0.5, 0.12, dist);
	float halo = smoothstep(0.5, 0.0, dist) * 0.22;

	float alpha = max(core, disc * 0.35) + halo;
	alpha *= uOpacity;

	vec3 starColor = kelvinToRgb(vTemperature);
	starColor *= (0.9 + 0.1 * vTwinkle);

	float sizeGlow = smoothstep(0.0, 4.0, vRadius);
	starColor *= mix(0.9, 1.12, sizeGlow);

	gl_FragColor = vec4(starColor, alpha);
}
