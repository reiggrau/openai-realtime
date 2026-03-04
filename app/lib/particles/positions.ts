// SPACE
export function getSpacePositions(count: number) {
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count * 3; i = i + 3) {
		positions[i + 0] = (Math.random() - 0.5) * 50; // X
		positions[i + 1] = (Math.random() - 0.5) * 50; // Y
		positions[i + 2] = (Math.random() - 0.5) * 50; // Z
	}
	return positions;
}

// GALAXY
export function getCorePositions(count: number, coreSize: number) {
	const positions = new Float32Array(count * 3);
	const arms = 4; // number of spiral arms
	const twist = 3.0; // how tightly the arms wind (radians over full radius)
	const spread = 0.35; // angular spread around each arm (radians)

	for (let i = 0; i < count * 3; i = i + 3) {
		// Pick a random arm
		const arm = Math.floor(Math.random() * arms);
		const armAngle = (arm / arms) * Math.PI * 2;

		// Radial distance: power-law so most stars cluster near the center
		const t = Math.random(); // 0..1
		const r = Math.pow(t, 1.6) * coreSize * 0.5;

		// Spiral angle: increases with distance from center
		const spiralAngle = armAngle + (r / (coreSize * 0.5)) * twist;

		// Scatter perpendicular to the arm (gaussian-ish)
		const scatter = (Math.random() + Math.random() + Math.random()) / 3.0 - 0.5;
		const theta = spiralAngle + scatter * spread * (1.0 + r * 0.3);

		// XY plane is the disc, Z is the thin axis
		positions[i + 0] = r * Math.cos(theta); // X
		positions[i + 1] = r * Math.sin(theta); // Y

		// Thin disc: vertical scatter decreases with radius
		const heightSpread = 0.06 * coreSize * (1.0 - t * 0.7);
		positions[i + 2] =
			(Math.random() - 0.5) * 2.0 * heightSpread * Math.random(); // Z
	}
	return positions;
}
