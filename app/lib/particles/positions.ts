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

// RING (gaussian width) — kept for future use
export function getRingPositions(count: number, coreSize: number) {
	const positions = new Float32Array(count * 3);
	const ringRadius = coreSize * 0.2; // center of the ring
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

// GALAXY — lenticular disc galaxy (S0): dense bulge + smooth exponential disc, no arms
export function getGalaxyPositions(count: number, coreSize: number) {
	const positions = new Float32Array(count * 3);

	// ~15% of stars in the central bulge, ~85% in the disc
	const bulgeCount = Math.floor(count * 0.15);

	const discScale = coreSize * 0.2; // exponential scale length of the disc (33% smaller)
	const bulgeScale = coreSize * 0.04; // bulge radius (compact, reduced)

	for (let i = 0; i < count; i++) {
		const idx = i * 3;
		const theta = Math.random() * Math.PI * 2;

		if (i < bulgeCount) {
			// --- BULGE: 3D gaussian sphere (denser, rounder) ---
			const r = boxMullerAbs() * bulgeScale;
			const phi = Math.acos(2 * Math.random() - 1); // uniform on sphere

			positions[idx + 0] = r * Math.sin(phi) * Math.cos(theta);
			positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
			positions[idx + 2] = r * Math.cos(phi) * 0.6; // slightly flattened
		} else {
			// --- DISC: exponential radial profile, thin vertical gaussian ---
			// Inverse CDF sampling of exponential disc: r = -scale * ln(1 - u)
			const u = Math.random() || 1e-10;
			const r = -discScale * Math.log(1 - u * 0.98); // cap at ~98% to avoid extreme outliers

			positions[idx + 0] = r * Math.cos(theta);
			positions[idx + 1] = r * Math.sin(theta);

			// Vertical scatter: thinner towards the edge, thicker near center
			const heightScale = coreSize * 0.012 * Math.exp(-r / discScale);
			positions[idx + 2] = boxMuller() * heightScale;
		}
	}
	return positions;
}

// Box-Muller transform helpers
function boxMuller(): number {
	const u1 = Math.random() || 1e-10;
	const u2 = Math.random();
	return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

function boxMullerAbs(): number {
	return Math.abs(boxMuller());
}
