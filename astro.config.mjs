// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain (GitHub Pages project site is served at domain root — base must be "/").
// https://docs.astro.build/en/reference/configuration-reference/#site
export default defineConfig({
	site: "https://thealbani.com",
	base: "/",
});
