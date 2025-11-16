import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	base: '/photography-agent-frontend/',
	build: {
		outDir: 'build'
	}
});
