/**
 * This is the main page component that renders at the root route ("/").
 */
export default function Home() {
	return (
		<main id="page">
			<div id="header"></div>
			<div id="content"></div>
			<div id="footer"></div>
			{/* Background with radial gradient from black edges to dark grey center */}
			<div
				id="background"
				className="absolute inset-0 w-screen h-screen bg-gradient-radial from-gray-800 via-gray-900 to-black"
			></div>
		</main>
	);
}
