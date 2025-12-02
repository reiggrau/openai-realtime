/**
 * API Route for fetching OpenAI Realtime ephemeral tokens
 * This keeps the API key secure on the server side
 */

import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// 1. Retrieve OPENAI_API_KEY from environment variables
		const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

		// 2. Fetch a client ephemeral token for Realtime API usage
		const response = await fetch(
			'https://api.openai.com/v1/realtime/client_secrets',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					session: {
						type: 'realtime',
						model: 'gpt-realtime',
					},
				}),
			}
		);

		const data = await response.json();

		const ephemeralToken: string = data.value;

		// 3. Return the ephemeral token in the response
		return NextResponse.json({ ephemeralToken }, { status: 200 });
	} catch (error) {
		// 4. Handle errors
		console.error('Error fetching ephemeral token:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
