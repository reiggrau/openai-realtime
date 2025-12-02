/**
 * API Route for fetching OpenAI Realtime ephemeral tokens
 * This keeps the API key secure on the server side
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

		return NextResponse.json({ ephemeralToken }, { status: 200 });
	} catch (error) {
		console.error('Error fetching ephemeral token:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
