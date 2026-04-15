// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain (GitHub Pages project site is served at domain root — base must be "/").
// If your canonical host is apex-only, set site to "https://thealbani.com" and put that in public/CNAME.
// https://docs.astro.build/en/reference/configuration-reference/#site
export default defineConfig({
	site: "https://www.thealbani.com",
	base: "/",
});
