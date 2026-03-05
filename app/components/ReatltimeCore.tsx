'use client';

import './RealtimeCore.css';

import { useEffect, useRef, useState } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';

import lookupPolicy from '../lib/tools/lookupPolicy';

import ConnectButton from './ConnectButton';
import MicButton from './MicButton';

interface Props {
	setParticlesView: (view: 'space' | 'core') => void;
}

export default function RealtimeCore({ setParticlesView }: Props) {
	// Use refs to prevent duplicate connections and store session
	const hasInitialized = useRef(false);
	const sessionRef = useRef<RealtimeSession | null>(null);

	const [ephemeralToken, setEphemeralToken] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(false);

	function toggleMute() {
		const session = sessionRef.current;
		if (!session || !isConnected) return;
		const newMuted = !isMuted;
		session.mute(newMuted);
		setIsMuted(newMuted);
	}

	// Reset mute when disconnected
	useEffect(() => {
		if (!isConnected) setIsMuted(false);
	}, [isConnected]);

	useEffect(() => {
		// 0. Prevent duplicate initialization (like React StrictMode double render)
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		async function init() {
			// 1. Fetch the client ephemeral token
			let token: string | null = null;
			try {
				const response = await fetch('/api/token');

				if (!response.ok)
					throw new Error(`Failed to fetch token: ${response.statusText}`);

				const data = await response.json();

				token = data.ephemeralToken;
				console.log('Fetched ephemeral token:', token);
				setEphemeralToken(token);
			} catch (e) {
				console.error('Error fetching ephemeral token:', e);
			}

			// 2. Create a RealtimeAgent instance and a session
			try {
				const agent = new RealtimeAgent({
					name: 'Assistant',
					instructions:
						"Et dius Samantha, i ets una assistent virtual d'intel·ligència artificial d'última generació de l'asseguradora ACME, especialitzada en atenció al client i en respondre preguntes sobre la pòlissa d'assegurança. Ets capaç de consultar la pòlissa de l'usuari gràcies a la tecnologia RAG. Si no trobes informació sobre la pregunta de l'usuari, respon que no saps la resposta en comptes d'inventar-te-la, i ofereix a l'usuari contactar amb un agent humà per obtenir més informació.",
					tools: [lookupPolicy], // Add the lookupPolicy tool to the agent
				});

				const session = new RealtimeSession(agent, {
					model: 'gpt-realtime',
				});

				sessionRef.current = session;
				console.log('Created Realtime session:', session);
			} catch (e) {
				console.error('Error connecting to Realtime session:', e);
			}
		}
		init();

		// Cleanup function to disconnect session when component unmounts
		return () => {
			if (sessionRef.current) {
				try {
					sessionRef.current.close();
					sessionRef.current = null;
				} catch (e) {
					console.error('Error closing Realtime session:', e);
				}
			}
			hasInitialized.current = false;
		};
	}, []);

	return (
		<div id="realtime-core">
			<ConnectButton
				session={sessionRef.current}
				ephemeralToken={ephemeralToken}
				isConnected={isConnected}
				setIsConnected={setIsConnected}
				setParticlesView={setParticlesView}
			/>
			{isConnected && <MicButton isMuted={isMuted} onToggle={toggleMute} />}
		</div>
	);
}
