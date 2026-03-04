// This component renders the particles background using Three.js.
// It uses the `useParticles` hook to manage the particles instance
// and update the view when the `view` prop changes.

'use client';

import './ParticlesBackground.css';

import { useEffect, useRef } from 'react';

import { useParticles, ParticlesView } from '@/app/hooks/useParticles';

interface Props {
	view?: ParticlesView;
}

export default function ParticlesBackground({ view = 'space' }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { setView } = useParticles(containerRef);

	// Update the particles view whenever the `view` prop changes
	useEffect(() => {
		setView(view);
	}, [view, setView]);

	return <div ref={containerRef} id="ParticlesBackground" />;
}
