attribute vec3 aTarget;
attribute vec3 aProperties;

uniform float uTime;
uniform float uPixelRatio;
uniform float uBaseSize;
uniform float uProgress;
uniform float uFrequency;

varying float vTemperature;
varying float vTwinkle;
varying float vRadius;

void main() {
	// Interpolate between current position and target based on progress (0-100)
	vec3 pos = mix(position, aTarget, uProgress * 0.01);

	float size = aProperties.x;
	float temperature = aProperties.y;
	float phase = aProperties.z * 6.28318530718;

	// Audio reactivity: push particles radially outward from center.
	// Smaller stars (lighter) are pushed more; bigger stars (heavier) barely move.
	float weight = clamp(size / 2.0, 0.1, 1.0);        // size ~0.2–4.2 → weight 0.1–1.0
	float invWeight = 1.0 - weight * weight;             // quadratic falloff: big stars nearly anchored
	float dist = length(pos.xy);
	float freqPush = uFrequency * 0.004 * invWeight * dist;
	vec2 dir = dist > 0.001 ? normalize(pos.xy) : vec2(0.0);
	pos.xy += dir * freqPush;

	float twinkle = 0.85 + 0.15 * sin(uTime * 1.3 + phase);

	vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
	vec4 viewPosition = viewMatrix * modelPosition;

	float depth = max(0.1, -viewPosition.z);
	float perspectiveScale = 1.0 / depth;

	float pointSize = uBaseSize * size * uPixelRatio * twinkle * perspectiveScale;

	gl_PointSize = clamp(pointSize, 0.8, 14.0);
	gl_Position = projectionMatrix * viewPosition;

	vTemperature = temperature;
	vTwinkle = twinkle;
	vRadius = gl_PointSize * 0.5;
}
