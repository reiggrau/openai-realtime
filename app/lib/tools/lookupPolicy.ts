import { tool } from '@openai/agents-realtime';
import { z } from 'zod';

// This tool allows the agent to query the insurance policy knowledge.
const lookupPolicy = tool({
	name: 'lookup_policy',
	description:
		'Search the insurance policy knowledge base. Use this whenever the user asks about coverage, deductibles, claims, limits, or any policy detail.',
	parameters: z.object({
		question: z.string().describe("The user's policy question in plain text"),
	}),
	execute: async ({ question }) => {
		const res = await fetch('http://localhost:8000/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question }),
		});
		const data = await res.json();
		return data.answer;
	},
});

export default lookupPolicy;
