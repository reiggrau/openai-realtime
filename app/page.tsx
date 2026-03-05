'use client';

import { useState } from 'react';
import { ParticlesView } from './hooks/useParticles';

import RealtimeCore from './components/ReatltimeCore';
import ParticlesBackground from './components/ParticlesBackground';

export default function Page() {
	const [particlesView, setParticlesView] = useState<ParticlesView>('space');
	const [audioFrequency, setAudioFrequency] = useState(0);

	return (
		<main id="page">
			<RealtimeCore
				setParticlesView={setParticlesView}
				setAudioFrequency={setAudioFrequency}
			/>
			<ParticlesBackground view={particlesView} frequency={audioFrequency} />
		</main>
	);
}
