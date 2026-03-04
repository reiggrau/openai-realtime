import type { NextConfig } from 'next'; // Import the NextConfig type for proper TypeScript support

/**
 * Next.js Configuration
 *
 * This file configures various aspects of the Next.js application build and runtime.
 * Currently using default settings, but can be extended with:
 *
 * Common configuration options:
 * - experimental: Enable experimental Next.js features
 * - images: Configure image optimization settings
 * - env: Define environment variables
 * - rewrites/redirects: Handle URL routing
 * - webpack: Customize webpack configuration
 * - output: Configure build output (e.g., for static export)
 *
 * Example configurations:
 * - reactStrictMode: true (enables React strict mode)
 * - swcMinify: true (use SWC for minification)
 * - images: { domains: ['example.com'] } (allow external image domains)
 */
const nextConfig: NextConfig = {
	turbopack: {
		rules: {
			'*.glsl': {
				loaders: ['raw-loader'],
				as: '*.js',
			},
		},
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.(glsl)$/i,
			type: 'asset/source',
		});

		return config;
	},
	/*
	 * Configuration options can be added here as the project grows.
	 * For now, using Next.js defaults which provide:
	 * - Automatic code splitting
	 * - Server-side rendering
	 * - Static site generation
	 * - Image optimization
	 * - Font optimization
	 */
};

// Export the configuration for Next.js to use during build and runtime
export default nextConfig;
