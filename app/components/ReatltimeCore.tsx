'use client';

import { useEffect, useRef, useState } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';

import ConnectButton from './ConnectButton';

export default function RealtimeCore() {
	// Use refs to prevent duplicate connections and store session
	const hasInitialized = useRef(false);
	const sessionRef = useRef<RealtimeSession | null>(null);

	const [ephemeralToken, setEphemeralToken] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

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
					instructions: 'You are a helpful assistant.',
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
		<div id="realtime-core" className="h-full w-full">
			<ConnectButton
				session={sessionRef.current}
				ephemeralToken={ephemeralToken}
				isConnected={isConnected}
				setIsConnected={setIsConnected}
			/>
		</div>
	);
}
