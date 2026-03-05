// This hook manages the lifecycle of the ThreeJsParticles instance, ensuring it is
// properly initialized and destroyed when the component mounts and unmounts.
// It also provides a method to change the particle view.

import { useEffect, useRef, useCallback } from 'react';

import ThreeJsParticles from '../lib/particles/threejs-particles';

export type ParticlesView = 'space' | 'core';

export function useParticles(
	containerRef: React.RefObject<HTMLDivElement | null>,
) {
	const particlesRef = useRef<ThreeJsParticles | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const particles = new ThreeJsParticles(containerRef.current);
		particlesRef.current = particles;

		return () => {
			particles.destroy();
			particlesRef.current = null;
		};
	}, [containerRef]);

	const setView = useCallback((view: ParticlesView) => {
		particlesRef.current?.setView(view);
	}, []);

	const setFrequency = useCallback((value: number) => {
		particlesRef.current?.setFrequency(value);
	}, []);

	return { setView, setFrequency };
}
