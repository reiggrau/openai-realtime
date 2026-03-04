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

// RING (gaussian width)
export function getCorePositions(count: number, coreSize: number) {
	const positions = new Float32Array(count * 3);
	const ringRadius = coreSize * 0.4; // center of the ring
	const ringWidth = coreSize * 0.08; // gaussian standard deviation (radial thickness)

	for (let i = 0; i < count * 3; i = i + 3) {
		// Random angle around the ring
		const theta = Math.random() * Math.PI * 2;

		// Gaussian offset from the ring center (Box-Muller)
		const u1 = Math.random() || 1e-10;
		const u2 = Math.random();
		const gaussian =
			Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

		const r = ringRadius + gaussian * ringWidth;

		positions[i + 0] = r * Math.cos(theta); // X
		positions[i + 1] = r * Math.sin(theta); // Y

		// Thin disc: slight vertical scatter
		const heightSpread = coreSize * 0.015;
		const gz =
			Math.sqrt(-2.0 * Math.log(Math.random() || 1e-10)) *
			Math.cos(2.0 * Math.PI * Math.random());
		positions[i + 2] = gz * heightSpread; // Z
	}
	return positions;
}

export function gaussianRandom() {
	return (Math.random() + Math.random() + Math.random()) / 3.0;
}
