import { Mic, MicOff } from '@mui/icons-material';
import styles from './MicButton.module.css';

interface Props {
	isMuted: boolean;
	onToggle: () => void;
}

export default function MicButton({ isMuted, onToggle }: Props) {
	return (
		<button
			className={`${styles.micBtn} ${isMuted ? styles.muted : ''}`}
			onClick={onToggle}
			title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
		>
			{isMuted ? <MicOff fontSize="medium" /> : <Mic fontSize="medium" />}
		</button>
	);
}
