import { RealtimeSession } from '@openai/agents-realtime';
import { useState } from 'react';
import styles from './ConnectButton.module.css';

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

		await session.connect({ apiKey: ephemeralToken! });
		console.log('Realtime session connected successfully!');

		setIsConnected(true);
		setInChanging(false);
	}

	function handleDisconnect() {
		if (!session || inChanging) return;
		setInChanging(true);

		session.close();
		console.log('Realtime session disconnected successfully!');
		setIsConnected(false);
		setInChanging(false);
	}

	if (!session) {
		return (
			<div className={styles.wrapper}>
				<button className={styles.btn} disabled>
					<span className={styles.edge} />
					<span className={styles.edge} />
					<span className={styles.edge} />
					<span className={styles.edge} />
					Loading...
				</button>
			</div>
		);
	}

	return (
		<div className={styles.wrapper}>
			<button
				className={styles.btn}
				onClick={isConnected ? handleDisconnect : handleConnect}
				disabled={!ephemeralToken || inChanging}
			>
				<span className={styles.edge} />
				<span className={styles.edge} />
				<span className={styles.edge} />
				<span className={styles.edge} />
				{isConnected ? 'Disconnect' : 'Connect'}
			</button>
		</div>
	);
}
