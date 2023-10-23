import { defineConfig } from 'tsup'

export default defineConfig({
	entry: [
		'src/next-client.tsx',
		'src/config.ts',
		'src/server.edge.ts',
		'src/server.ts',
	],
	format: ['cjs', 'esm'],
	target: 'esnext',
	minify: false,
	dts: true,
	sourcemap: true,
	noExternal: [],
})
