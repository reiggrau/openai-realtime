import { RealtimeSession } from '@openai/agents-realtime';
import { useState } from 'react';

interface Props {
	session: RealtimeSession | null;
	ephemeralToken: string | null;
	isConnected: boolean;
	setIsConnected: (connected: boolean) => void;
}

export default function ConnectButton({
	session,
	ephemeralToken,
	isConnected,
	setIsConnected,
}: Props) {
	const [inChanging, setInChanging] = useState(false);

	async function handleConnect() {
		if (!session || inChanging) return;
		setInChanging(true);

		// 1. Connect the session using the fetched ephemeral token
		await session.connect({ apiKey: ephemeralToken! });
		console.log('Realtime session connected successfully!');

		setIsConnected(true);
		setInChanging(false);
	}

	function handleDisconnect() {
		if (!session || inChanging) return;
		setInChanging(true);

		// 1. Disconnect the session
		session.close();
		console.log('Realtime session disconnected successfully!');
		setIsConnected(false);
		setInChanging(false);
	}

	if (!session) {
		return <button disabled>Loading...</button>;
	}

	return (
		<button
			onClick={isConnected ? handleDisconnect : handleConnect}
			disabled={!ephemeralToken || inChanging}
		>
			{isConnected ? 'Disconnect' : 'Connect'}
		</button>
	);
}
