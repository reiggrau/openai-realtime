'use client';

import { useState } from 'react';
import { ParticlesView } from './hooks/useParticles';

import RealtimeCore from './components/ReatltimeCore';
import ParticlesBackground from './components/ParticlesBackground';

export default function Page() {
	const [particlesView, setParticlesView] = useState<ParticlesView>('space');

	return (
		<main id="page">
			{/* <RealtimeCore setParticlesView={setParticlesView} /> */}
			<ParticlesBackground view={particlesView} />
		</main>
	);
}
