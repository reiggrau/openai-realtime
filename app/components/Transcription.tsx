import './Transcription.css';

import { Fade } from '@mui/material';

export interface SubtitleEntry {
	type: 'assistant' | 'tool';
	text: string;
}

interface Props {
	entry: SubtitleEntry | null;
}

export default function Transcription({ entry }: Props) {
	return (
		<div id="transcription">
			<Fade in={!!entry} timeout={400}>
				<div className="subtitle">
					{entry?.type === 'assistant' && (
						<>
							<span className="label assistant">Assistant:</span>
							{entry.text}
						</>
					)}
					{entry?.type === 'tool' && (
						<span className="tool-info">[{entry.text}]</span>
					)}
				</div>
			</Fade>
		</div>
	);
}
